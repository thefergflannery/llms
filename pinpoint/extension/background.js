// Pincue — background service worker
// Handles: screenshot capture (captureVisibleTab), session storage, message relay

import { drawBboxOverlay } from './utils/screenshot.js';
import { sbSyncSession, sbSyncNote } from './utils/supabase.js';

// Open the side panel when the icon is clicked.
// activeTab is granted here — use it to proactively inject content.js into pages
// that were open before the extension loaded (declarative injection doesn't cover those).
chrome.action.onClicked.addListener((tab) => {
  // Both calls are synchronous within the user-gesture frame.
  // sidePanel.open MUST be synchronous (Chrome requirement).
  // executeScript also needs to be called synchronously to pass the activeTab
  // permission check — awaiting anything first loses the gesture context.
  chrome.sidePanel.open({ windowId: tab.windowId }).catch(e =>
    console.warn('Pincue: sidePanel.open failed:', e.message)
  );

  if (tab.url?.startsWith('http://') || tab.url?.startsWith('https://')) {
    // Fire-and-forget. content.js has a _ppAlreadyLoaded guard so double-injection
    // on pages that already have the declarative script is a safe no-op.
    chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] })
      .catch(e => console.warn('Pincue: injection failed:', e.message));
  }
});

// When the side panel closes, auto-clear the active session for free users.
// Premium users retain their session across panel opens (future persistence).
// Keep content-script ports alive — if they go out of scope Chrome GC's them,
// which triggers onDisconnect in the content script and falsely signals a reload.
const _contentPorts = new Set();

chrome.runtime.onConnect.addListener(port => {
  // 'pinic-content' ports are kept alive so content.js can detect extension reload via onDisconnect.
  if (port.name === 'pinic-content') {
    _contentPorts.add(port);
    port.onDisconnect.addListener(() => _contentPorts.delete(port));
    return;
  }
  if (port.name !== 'sidepanel') return;
  port.onDisconnect.addListener(async () => {
    const { 'pinic:account': account } = await chrome.storage.local.get('pinic:account');
    const premium = account?.plan === 'premium' || account?.superuser === true;
    if (premium) return;
    const { 'pinpoint:active': activeId } = await chrome.storage.local.get('pinpoint:active');
    if (!activeId) return;
    const { 'pinpoint:sessions': sessions = [] } = await chrome.storage.local.get('pinpoint:sessions');
    await chrome.storage.local.remove([`pinpoint:session:${activeId}`]);
    await chrome.storage.local.set({
      'pinpoint:active': null,
      'pinpoint:sessions': sessions.filter(s => s.id !== activeId)
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'CAPTURE_SCREENSHOT':
      if (!sender?.tab?.windowId) {
        sendResponse({ error: 'No tab context — reload the page and try again.' });
        return true;
      }
      captureAndAnnotate(sender.tab.windowId, message.payload)
        .then(dataUrl => sendResponse({ dataUrl }))
        .catch(err => sendResponse({ error: err.message }));
      return true;

    case 'START_SESSION':
      startSession(message.payload)
        .then(session => sendResponse({ session }))
        .catch(err => sendResponse({ error: err.message }));
      return true;

    case 'GET_SESSION':
      getActiveSession()
        .then(session => sendResponse({ session }))
        .catch(err => sendResponse({ error: err.message }));
      return true;

    case 'SAVE_NOTE':
      saveNote(message.payload)
        .then(() => sendResponse({ ok: true }))
        .catch(err => sendResponse({ error: err.message }));
      return true;

    case 'DELETE_NOTE':
      deleteNote(message.payload.noteId)
        .then(() => sendResponse({ ok: true }))
        .catch(err => sendResponse({ error: err.message }));
      return true;

    case 'UPDATE_NOTE':
      updateNote(message.payload)
        .then(() => sendResponse({ ok: true }))
        .catch(err => sendResponse({ error: err.message }));
      return true;

    case 'RENAME_SESSION':
      renameSession(message.payload.name)
        .then(() => sendResponse({ ok: true }))
        .catch(err => sendResponse({ error: err.message }));
      return true;

    case 'END_SESSION':
      endSession()
        .then(() => sendResponse({ ok: true }))
        .catch(err => sendResponse({ error: err.message }));
      return true;

    case 'RESTORE_SESSION':
      restoreSession(message.payload.session)
        .then(session => sendResponse({ session }))
        .catch(err => sendResponse({ error: err.message }));
      return true;

  }
});

// --- Screenshot ---

async function captureAndAnnotate(windowId, { bbox, devicePixelRatio, selector }) {
  let dataUrl;
  try {
    dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
  } catch {
    // Fallback: find the focused normal window
    const wins = await chrome.windows.getAll({ windowTypes: ['normal'] });
    const focused = wins.find(w => w.focused) || wins[0];
    if (!focused) throw new Error('No window available to capture');
    dataUrl = await chrome.tabs.captureVisibleTab(focused.id, { format: 'png' });
  }
  return drawBboxOverlay(dataUrl, bbox, devicePixelRatio, selector);
}

// --- Session storage ---

async function startSession({ name, url }) {
  const id = crypto.randomUUID();
  const session = {
    id,
    name: name || 'Untitled session',
    createdAt: new Date().toISOString(),
    url,
    notes: []
  };
  const { 'pinpoint:sessions': sessions = [] } = await chrome.storage.local.get('pinpoint:sessions');
  sessions.push({ id, name: session.name, createdAt: session.createdAt, url });
  await chrome.storage.local.set({
    [`pinpoint:session:${id}`]: session,
    'pinpoint:sessions': sessions,
    'pinpoint:active': id
  });
  const { 'pinic:account': account } = await chrome.storage.local.get('pinic:account');
  if (account?.plan === 'premium' || account?.superuser === true) {
    sbSyncSession(session).catch(() => {});
  }
  return session;
}

async function getActiveSession() {
  const { 'pinpoint:active': activeId } = await chrome.storage.local.get('pinpoint:active');
  if (!activeId) return null;
  const result = await chrome.storage.local.get(`pinpoint:session:${activeId}`);
  return result[`pinpoint:session:${activeId}`] || null;
}

const NOTE_LIMIT = 15;

async function saveNote(note) {
  const session = await getActiveSession();
  if (!session) throw new Error('No active session');
  const { 'pinic:account': account } = await chrome.storage.local.get('pinic:account');
  const premium = account?.plan === 'premium' || account?.superuser === true;
  if (!premium && session.notes.length >= NOTE_LIMIT) {
    throw new Error(`Note limit reached — export your session to continue (${NOTE_LIMIT} notes max on the free plan).`);
  }
  note.id = note.id || crypto.randomUUID();
  note.sessionId = session.id;
  session.notes.push(note);
  await chrome.storage.local.set({ [`pinpoint:session:${session.id}`]: session });
  if (premium) {
    sbSyncNote(note, session.id).catch(() => {});
  }
}

async function deleteNote(noteId) {
  const session = await getActiveSession();
  if (!session) throw new Error('No active session');
  session.notes = session.notes.filter(n => n.id !== noteId);
  await chrome.storage.local.set({ [`pinpoint:session:${session.id}`]: session });
}

async function updateNote({ noteId, note, severity, suggestedFix }) {
  const session = await getActiveSession();
  if (!session) throw new Error('No active session');
  const existing = session.notes.find(n => n.id === noteId);
  if (!existing) throw new Error('Note not found');
  if (note !== undefined) existing.note = note;
  if (severity !== undefined) existing.severity = severity;
  if (suggestedFix !== undefined) existing.suggestedFix = suggestedFix;
  await chrome.storage.local.set({ [`pinpoint:session:${session.id}`]: session });
}

async function renameSession(name) {
  const session = await getActiveSession();
  if (!session) throw new Error('No active session');
  session.name = name;
  const { 'pinpoint:sessions': sessions = [] } = await chrome.storage.local.get('pinpoint:sessions');
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx !== -1) sessions[idx].name = name;
  await chrome.storage.local.set({
    [`pinpoint:session:${session.id}`]: session,
    'pinpoint:sessions': sessions
  });
}

async function endSession() {
  await chrome.storage.local.set({ 'pinpoint:active': null });
}

async function restoreSession(session) {
  const { 'pinpoint:sessions': sessions = [] } = await chrome.storage.local.get('pinpoint:sessions');
  const exists = sessions.find(s => s.id === session.id);
  if (!exists) {
    sessions.push({ id: session.id, name: session.name, createdAt: session.createdAt || session.created_at, url: session.url });
  }
  await chrome.storage.local.set({
    [`pinpoint:session:${session.id}`]: session,
    'pinpoint:sessions': sessions,
    'pinpoint:active': session.id
  });
  return session;
}
