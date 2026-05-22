// Pincue side panel — session overview, note list, export controls

import { formatSession, sessionFilename } from '../utils/export-md.js';
import { sbGetSession, sbGetProfile, sbSignUp, sbSignIn, sbSignOut, sbGetRemoteSessions, sbGetRemoteNotes, sbDeleteSession, sbAddToWaitlist, sbShareSession } from '../utils/supabase.js';
import { phCapture, phIdentify } from '../utils/analytics.js';

// Keep a persistent port so background.js can detect panel close and
// auto-clear free-tier sessions when the panel is dismissed.
const _panelPort = chrome.runtime.connect({ name: 'sidepanel' });

// ─── Element refs ─────────────────────────────────────────────────────────────

const $ = id => document.getElementById(id);

const needsReloadEl       = $('pp-needs-reload');
const unavailableEl       = $('pp-unavailable');
const emptyStateEl        = $('pp-empty-state');
const startFormEl         = $('pp-start-form');
const sessionViewEl       = $('pp-session-view');
const endBtn              = $('pp-end-btn');
const startBtn            = $('pp-start-btn');
const cancelStartBtn      = $('pp-cancel-start-btn');
const createBtn           = $('pp-create-btn');
const sessionNameInput    = $('pp-session-name-input');
const sessionNameDisplay  = $('pp-session-name-display');
const sessionUrlDisplay   = $('pp-session-url-display');
const notesList           = $('pp-notes-list');
const emptyNotesEl        = $('pp-empty-notes');
const noFilterMatchEl     = $('pp-no-filter-match');
const activateBtn         = $('pp-activate-btn');
const copyBtn             = $('pp-copy-btn');
const downloadBtn         = $('pp-download-btn');
const introEl             = $('pp-intro');

// Session rename
const sessionRenameBtn    = $('pp-session-rename-btn');
const sessionRenameForm   = $('pp-session-rename-form');
const sessionRenameInput  = $('pp-session-rename-input');
const sessionRenameCancel = $('pp-session-rename-cancel');
const sessionRenameSave   = $('pp-session-rename-save');

// Account
const accountBtn          = $('pp-account-btn');
const accountPanel        = $('pp-account-panel');
const accountCloseBtn     = $('pp-account-close-btn');
const accountSignedOut    = $('pp-account-signedout');
const accountSignedIn     = $('pp-account-signedin');

// ─── State ────────────────────────────────────────────────────────────────────

let _capturing    = false;
let _activeFilter = 'all';
let _currentSession = null;

// ─── Init ─────────────────────────────────────────────────────────────────────

init();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  const keys = Object.keys(changes);
  const hasSessionChange = keys.some(k => k.startsWith('pinpoint:session:') || k === 'pinpoint:active');
  if (hasSessionChange) refreshSession();
});

async function init() {
  phCapture('extension_opened');
  initFilters();
  initSessionRename();
  initAccount();
  wireIntroButtons();

  // Try Supabase session first — pull fresh profile and cache locally
  const sbSession = await sbGetSession();
  if (sbSession) {
    const profile = await sbGetProfile();
    if (profile) {
      const account = { name: profile.name, email: profile.email, plan: profile.plan, superuser: profile.superuser || false };
      await chrome.storage.local.set({ 'pinic:account': account });
      showAccountSignedIn(account);
    }
    await refreshSession();
    return;
  }

  // Fall back to cached local account (superuser bypass or offline)
  const { 'pinic:account': account } = await chrome.storage.local.get('pinic:account');
  if (account) {
    showAccountSignedIn(account);
    await refreshSession();
    return;
  }

  // No account — show intro unless user has already dismissed it this session
  const { 'pinic:intro_seen': introSeen } = await chrome.storage.local.get('pinic:intro_seen');
  if (introSeen) {
    await refreshSession();
  } else {
    show(introEl);
    endBtn.hidden = true;
  }
}

function wireIntroButtons() {
  // pp-intro-signup-btn is disabled (coming soon) — no handler needed
  $('pp-intro-signin-btn').addEventListener('click', () => {
    accountPanel.hidden = false;
    document.querySelectorAll('.pp-tab').forEach(t => t.classList.toggle('pp-tab-active', t.dataset.tab === 'signin'));
    $('pp-tab-signup').hidden = true;
    $('pp-tab-signin').hidden = false;
  });
  $('pp-intro-skip-btn').addEventListener('click', async () => {
    await chrome.storage.local.set({ 'pinic:intro_seen': true });
    refreshSession();
  });
}

async function refreshSession() {
  const session = await bgMessage({ type: 'GET_SESSION' });
  _currentSession = session;
  if (session) {
    const rc = $('pp-restore-card');
    if (rc) rc.hidden = true;
    showSessionView(session);
  } else {
    show(emptyStateEl);
    endBtn.hidden = true;
    tryShowRestoreCard();
  }
}

async function tryShowRestoreCard() {
  const restoreCard = $('pp-restore-card');
  if (!restoreCard) return;
  restoreCard.hidden = true;
  const { 'pinic:account': account } = await chrome.storage.local.get('pinic:account');
  const isPremium = account?.plan === 'premium' || account?.superuser === true;
  if (!isPremium) return;
  try {
    const remote = await sbGetRemoteSessions();
    if (!remote.length) return;
    const latest = remote[0];
    $('pp-restore-name').textContent = latest.name;
    const date = new Date(latest.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    $('pp-restore-meta').textContent = date + (latest.url ? ' · ' + new URL(latest.url).hostname : '');
    restoreCard.hidden = false;
    $('pp-restore-btn').onclick = async () => {
      const btn = $('pp-restore-btn');
      btn.disabled = true;
      btn.textContent = 'Loading…';
      try {
        const remoteNotes = await sbGetRemoteNotes(latest.id);
        const session = {
          id: latest.id,
          name: latest.name,
          createdAt: latest.created_at,
          url: latest.url,
          notes: remoteNotes.map(n => ({
            id: n.id,
            sessionId: n.session_id,
            severity: n.severity,
            note: n.note,
            suggestedFix: n.suggested_fix,
            element: n.element,
            screenshotDataUrl: n.screenshot_data_url || null
          }))
        };
        await bgMessage({ type: 'RESTORE_SESSION', payload: { session } });
        restoreCard.hidden = true;
        await refreshSession();
      } catch {
        btn.disabled = false;
        btn.textContent = 'Resume';
      }
    };
  } catch {}
}

// ─── Tab helpers ──────────────────────────────────────────────────────────────

async function getActiveTab() {
  try {
    const win = await chrome.windows.getCurrent();
    const [tab] = await chrome.tabs.query({ active: true, windowId: win.id });
    return tab || null;
  } catch {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    return tab || null;
  }
}

function isInjectablePage(url) {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
}

// ─── Views ────────────────────────────────────────────────────────────────────

function show(el) {
  [needsReloadEl, unavailableEl, emptyStateEl, startFormEl, sessionViewEl, introEl].forEach(e => e.hidden = true);
  el.hidden = false;
}

function showSessionView(session) {
  show(sessionViewEl);
  endBtn.hidden = false;
  sessionNameDisplay.textContent = session.name;
  // Pill updated by renderNotes() below
  sessionUrlDisplay.textContent = session.url;
  renderNotes(session.notes);
}

// ─── Session history (premium) ────────────────────────────────────────────────

async function loadHistory() {
  const historyEl  = $('pp-history');
  const listEl     = $('pp-history-list');
  const loadingEl  = $('pp-history-loading');
  const emptyEl    = $('pp-history-empty');
  const upgradeEl  = $('pp-history-upgrade');
  if (!historyEl) return;

  historyEl.hidden = false;
  loadingEl.hidden = false;
  listEl.innerHTML = '';
  emptyEl.hidden = true;
  upgradeEl.hidden = true;

  const { 'pinic:account': account } = await chrome.storage.local.get('pinic:account');
  const isPremium = account?.plan === 'premium' || account?.superuser === true;

  if (!isPremium) {
    loadingEl.hidden = true;
    upgradeEl.hidden = false;
    return;
  }

  // Load local sessions (fast), excluding any currently active session
  const [{ 'pinpoint:sessions': localSessions = [] }, { 'pinpoint:active': activeId }] =
    await Promise.all([
      chrome.storage.local.get('pinpoint:sessions'),
      chrome.storage.local.get('pinpoint:active')
    ]);

  let sessions = localSessions
    .filter(s => s.id !== activeId)
    .map(s => ({ ...s, created_at: s.createdAt }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Enrich with Supabase for cross-device sessions
  try {
    const remote = await sbGetRemoteSessions();
    if (remote.length > 0) {
      const remoteIds = new Set(remote.map(r => r.id));
      const localOnly = sessions.filter(s => !remoteIds.has(s.id));
      sessions = [...remote, ...localOnly].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  } catch { /* fall back to local */ }

  loadingEl.hidden = true;

  if (!sessions.length) { emptyEl.hidden = false; return; }

  sessions.forEach(session => {
    const card = document.createElement('div');
    card.className = 'pp-history-card';
    const date = new Date(session.created_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
    const host = session.url ? (() => { try { return new URL(session.url).hostname; } catch { return session.url; } })() : '';
    card.innerHTML = `
      <div class="pp-history-card-row">
        <div class="pp-history-card-info">
          <div class="pp-history-card-name">${esc(session.name)}</div>
          <div class="pp-history-card-meta">
            <span>${esc(date)}</span>${host ? `<span class="pp-history-dot">·</span><span class="pp-history-host">${esc(host)}</span>` : ''}
          </div>
        </div>
        <button class="pp-history-delete-btn" aria-label="Delete session" title="Delete">
          <i class="ti ti-trash"></i>
        </button>
      </div>
    `;
    card.querySelector('.pp-history-delete-btn').addEventListener('click', async e => {
      e.stopPropagation();
      await deleteHistorySession(session.id);
      card.remove();
      if (!listEl.querySelector('.pp-history-card')) emptyEl.hidden = false;
    });
    listEl.appendChild(card);
  });
}

async function deleteHistorySession(sessionId) {
  const { 'pinpoint:sessions': sessions = [] } = await chrome.storage.local.get('pinpoint:sessions');
  await chrome.storage.local.set({ 'pinpoint:sessions': sessions.filter(s => s.id !== sessionId) });
  await chrome.storage.local.remove(`pinpoint:session:${sessionId}`);
  try { await sbDeleteSession(sessionId); } catch {}
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

function initFilters() {
  document.querySelectorAll('.pp-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      _activeFilter = pill.dataset.filter;
      document.querySelectorAll('.pp-filter-pill').forEach(p => p.classList.remove('pp-filter-active'));
      pill.classList.add('pp-filter-active');
      if (_currentSession) renderNotes(_currentSession.notes);
    });
  });
}

// ─── Note list ────────────────────────────────────────────────────────────────

const _SEVERITY_LABEL = { accessibility: 'A11y' };
function severityLabel(s) { return _SEVERITY_LABEL[s] || s; }

const NOTE_LIMIT = 15;

let _prevNoteCount = 0;

function renderNotes(notes) {
  // Track new note captures and limit hits
  if (notes.length > _prevNoteCount) {
    const newest = notes[notes.length - 1];
    phCapture('note_captured', { severity: newest?.severity, note_count: notes.length });
  }
  if (notes.length >= NOTE_LIMIT && _prevNoteCount < NOTE_LIMIT) {
    phCapture('note_limit_reached');
  }
  _prevNoteCount = notes.length;

  // Always sync the pill with the true note count
  const countPill = $('pp-note-count-pill');
  if (countPill) {
    countPill.textContent = `${notes.length}/${NOTE_LIMIT}`;
    countPill.classList.toggle('pp-note-pill-full', notes.length >= NOTE_LIMIT);
  }
  // Disable capture when at limit
  const atLimit = notes.length >= NOTE_LIMIT;
  activateBtn.disabled = atLimit;
  activateBtn.title = atLimit ? `Note limit reached (${NOTE_LIMIT}/session). Export and start a new session.` : '';

  notesList.innerHTML = '';

  const filtered = _activeFilter === 'all'
    ? notes
    : notes.filter(n => n.severity === _activeFilter);

  emptyNotesEl.hidden   = notes.length > 0;
  noFilterMatchEl.hidden = !(notes.length > 0 && filtered.length === 0);

  filtered.forEach((note, i) => {
    const el = note.element;
    const item = document.createElement('div');
    item.className = 'pp-note-item';
    item.setAttribute('role', 'listitem');
    item.dataset.noteId = note.id;

    const fixPreview = note.suggestedFix
      ? `<div class="pp-note-fix">${esc(note.suggestedFix.slice(0, 60))}</div>`
      : '';

    item.innerHTML = `
      <div class="pp-note-row1">
        <span class="pp-note-pill" data-severity="${note.severity}">${severityLabel(note.severity)}</span>
        <span class="pp-note-selector" title="${esc(el.selector)}">${esc(el.selector)}</span>
        <div class="pp-note-actions">
          <button class="pp-note-action-btn edit" aria-label="Edit note ${i + 1}" title="Edit">
            <i class="ti ti-pencil"></i>
          </button>
          <button class="pp-note-action-btn delete" aria-label="Delete note ${i + 1}" title="Delete">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      </div>
      <div class="pp-note-text">${esc((note.note || '').slice(0, 80))}</div>
      ${fixPreview}
    `;

    // Hover → highlight element in page
    item.addEventListener('mouseenter', async () => {
      const tab = await getActiveTab();
      if (!tab?.id) return;
      try { await chrome.tabs.sendMessage(tab.id, { type: 'HIGHLIGHT_ELEMENT', payload: { selector: el.selector } }); } catch {}
    });
    item.addEventListener('mouseleave', async () => {
      const tab = await getActiveTab();
      if (!tab?.id) return;
      try { await chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_HIGHLIGHT' }); } catch {}
    });

    // Delete
    item.querySelector('.delete').addEventListener('click', async e => {
      e.stopPropagation();
      await bgMessage({ type: 'DELETE_NOTE', payload: { noteId: note.id } });
    });

    // Edit — inline form
    item.querySelector('.edit').addEventListener('click', e => {
      e.stopPropagation();
      openNoteEditForm(item, note);
    });

    notesList.appendChild(item);
  });
}

function openNoteEditForm(item, note) {
  if (item.querySelector('.pp-note-edit-form')) return;
  item.classList.add('pp-note-editing');

  const severities = ['bug', 'ux', 'style', 'copy', 'accessibility'];
  let editSeverity = note.severity;

  const form = document.createElement('div');
  form.className = 'pp-note-edit-form';
  form.innerHTML = `
    <div class="pp-note-edit-severities">
      ${severities.map(s => `<button class="pp-sev-pick${s === editSeverity ? ' active' : ''}" data-s="${s}">${severityLabel(s)}</button>`).join('')}
    </div>
    <span class="pp-note-edit-label">Note</span>
    <textarea class="pp-note-edit-textarea pp-note-edit-note" rows="3" placeholder="Describe the issue…">${esc(note.note || '')}</textarea>
    <span class="pp-note-edit-validation" hidden>Note text is required.</span>
    <span class="pp-note-edit-label">Suggested fix <em>(optional)</em></span>
    <textarea class="pp-note-edit-textarea pp-note-edit-fix" rows="2" placeholder="How would you fix this?">${esc(note.suggestedFix || '')}</textarea>
    <div class="pp-note-edit-actions">
      <button class="pp-btn pp-btn-secondary pp-btn-sm" data-action="cancel">Cancel</button>
      <button class="pp-btn pp-btn-primary pp-btn-sm" data-action="save">Save</button>
    </div>
  `;

  form.querySelectorAll('.pp-sev-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      editSeverity = btn.dataset.s;
      form.querySelectorAll('.pp-sev-pick').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  form.querySelector('[data-action="cancel"]').addEventListener('click', () => {
    item.classList.remove('pp-note-editing');
    form.remove();
  });

  form.querySelector('[data-action="save"]').addEventListener('click', async () => {
    const saveBtn = form.querySelector('[data-action="save"]');
    const newText = form.querySelector('.pp-note-edit-note').value.trim();
    const newFix  = form.querySelector('.pp-note-edit-fix').value.trim() || null;
    const validMsg = form.querySelector('.pp-note-edit-validation');
    if (!newText) {
      if (validMsg) validMsg.hidden = false;
      form.querySelector('.pp-note-edit-note').focus();
      return;
    }
    if (validMsg) validMsg.hidden = true;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';
    try {
      await bgMessage({ type: 'UPDATE_NOTE', payload: { noteId: note.id, note: newText, severity: editSeverity, suggestedFix: newFix } });
      const updated = await bgMessage({ type: 'GET_SESSION' });
      if (updated) { _currentSession = updated; renderNotes(updated.notes); }
    } catch {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
    }
  });

  item.appendChild(form);
  form.querySelector('.pp-note-edit-textarea').focus();
}

// ─── Session rename ───────────────────────────────────────────────────────────

function initSessionRename() {
  sessionRenameBtn.addEventListener('click', () => {
    sessionRenameForm.hidden = false;
    sessionRenameInput.value = _currentSession?.name || '';
    sessionRenameInput.focus();
    sessionRenameInput.select();
  });

  sessionRenameCancel.addEventListener('click', () => {
    sessionRenameForm.hidden = true;
  });

  sessionRenameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sessionRenameSave.click();
    if (e.key === 'Escape') sessionRenameCancel.click();
  });

  sessionRenameSave.addEventListener('click', async () => {
    const name = sessionRenameInput.value.trim();
    if (!name) { sessionRenameInput.focus(); return; }
    await bgMessage({ type: 'RENAME_SESSION', payload: { name } });
    sessionRenameForm.hidden = true;
    // storage listener triggers re-render
  });
}

// ─── Account panel ────────────────────────────────────────────────────────────

function setAuthError(id, msg) {
  const el = $(id);
  if (el) { el.textContent = msg; el.hidden = !msg; }
}

function setAuthLoading(btnId, loading) {
  const btn = $(btnId);
  if (btn) { btn.disabled = loading; btn.textContent = loading ? 'Please wait…' : btn.dataset.label || btn.textContent; }
}

function initAccount() {
  accountBtn.addEventListener('click', () => { accountPanel.hidden = !accountPanel.hidden; });
  accountCloseBtn.addEventListener('click', () => { accountPanel.hidden = true; });

  // Tabs
  document.querySelectorAll('.pp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pp-tab').forEach(t => t.classList.remove('pp-tab-active'));
      tab.classList.add('pp-tab-active');
      $('pp-tab-signup').hidden = tab.dataset.tab !== 'signup';
      $('pp-tab-signin').hidden = tab.dataset.tab !== 'signin';
      setAuthError('pp-signup-error', '');
      setAuthError('pp-signin-error', '');
    });
  });

  // Sign up — real Supabase auth
  $('pp-signup-btn').addEventListener('click', async () => {
    const name  = $('pp-signup-name').value.trim();
    const email = $('pp-signup-email').value.trim();
    const pass  = $('pp-signup-password').value;
    setAuthError('pp-signup-error', '');
    if (!name || !email || pass.length < 8) {
      setAuthError('pp-signup-error', 'Name, email and a password of 8+ characters are required.');
      return;
    }
    $('pp-signup-btn').disabled = true;
    $('pp-signup-btn').textContent = 'Creating account…';
    try {
      const result = await sbSignUp({ name, email, password: pass });
      if (result.needsConfirmation) {
        // Email confirmation is disabled — this branch shouldn't fire.
        // If it does, Supabase Auth → Providers → Email → turn off "Confirm email".
        setAuthError('pp-signup-error', '✓ Check your email to confirm, then sign in.');
        return;
      }
      const profile = await sbGetProfile();
      const account = { name: profile?.name || name, email, plan: profile?.plan || 'free', superuser: false };
      await chrome.storage.local.set({ 'pinic:account': account, 'pinic:intro_seen': true });
      await phIdentify(email, { name, plan: account.plan });
      phCapture('account_signed_up', { plan: account.plan });
      showAccountSignedIn(account);
      accountPanel.hidden = true;
      refreshSession();
    } catch (err) {
      setAuthError('pp-signup-error', err.message);
    } finally {
      $('pp-signup-btn').disabled = false;
      $('pp-signup-btn').textContent = 'Create account';
    }
  });

  // Sign in — real Supabase auth
  $('pp-signin-btn').addEventListener('click', async () => {
    const email = $('pp-signin-email').value.trim();
    const pass  = $('pp-signin-password').value;
    setAuthError('pp-signin-error', '');
    if (!email || !pass) { setAuthError('pp-signin-error', 'Email and password are required.'); return; }
    $('pp-signin-btn').disabled = true;
    $('pp-signin-btn').textContent = 'Signing in…';
    try {
      await sbSignIn({ email, password: pass });
      const profile = await sbGetProfile();
      const account = { name: profile?.name || email.split('@')[0], email, plan: profile?.plan || 'free', superuser: profile?.superuser || false };
      await chrome.storage.local.set({ 'pinic:account': account, 'pinic:intro_seen': true });
      await phIdentify(email, { name: account.name, plan: account.plan });
      phCapture('account_signed_in');
      showAccountSignedIn(account);
      accountPanel.hidden = true;
      refreshSession();
    } catch (err) {
      setAuthError('pp-signin-error', err.message);
    } finally {
      $('pp-signin-btn').disabled = false;
      $('pp-signin-btn').textContent = 'Sign in';
    }
  });

  const upgradeBtn = $('pp-upgrade-btn');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', async () => {
      upgradeBtn.disabled = true;
      try {
        const { 'pinic:account': account } = await chrome.storage.local.get('pinic:account');
        const email = account?.email || '';
        if (email) {
          await sbAddToWaitlist(email);
        }
        phCapture('waitlist_joined', { source: 'extension_upgrade_btn' });
        $('pp-upgrade-error').hidden = true;
        $('pp-upgrade-coming').hidden = false;
        upgradeBtn.hidden = true;
      } catch {
        setAuthError('pp-upgrade-error', 'Could not save — email us at hi@getpincue.com');
        upgradeBtn.disabled = false;
      }
    });
  }

  // History upgrade button — Pro coming soon, open account panel
  const histUpgradeBtn = $('pp-history-upgrade-btn');
  if (histUpgradeBtn) {
    histUpgradeBtn.addEventListener('click', () => {
      accountPanel.hidden = false;
    });
  }

  // Sign out
  $('pp-signout-btn').addEventListener('click', async () => {
    phCapture('account_signed_out');
    await sbSignOut();
    await chrome.storage.local.remove(['pinic:account', 'pinpoint:active', 'pinic:intro_seen']);
    accountSignedIn.hidden = true;
    accountSignedOut.hidden = false;
    accountPanel.hidden = true;
    _currentSession = null;
    setCapturing(false);
    show(introEl);
  });
}

function showAccountSignedIn(account) {
  if (!account) return;
  accountSignedOut.hidden = true;
  accountSignedIn.hidden = false;
  $('pp-account-avatar').textContent = (account.name || account.email || '?')[0].toUpperCase();
  $('pp-account-name-display').textContent = account.name || 'User';
  $('pp-account-email-display').textContent = account.email || '';
  // Hide upgrade button if already premium or superuser
  const isPremium = account?.plan === 'premium' || account?.superuser === true;
  const upgradeWrap = $('pp-upgrade-wrap');
  if (upgradeWrap) upgradeWrap.hidden = isPremium;
}

// ─── Session start / end ──────────────────────────────────────────────────────

startBtn.addEventListener('click', () => {
  show(startFormEl);
  endBtn.hidden = true;
  sessionNameInput.value = '';
  sessionNameInput.focus();
});

cancelStartBtn.addEventListener('click', async () => {
  const session = await bgMessage({ type: 'GET_SESSION' });
  if (session) showSessionView(session); else show(emptyStateEl);
});

sessionNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') createBtn.click(); });

createBtn.addEventListener('click', async () => {
  const name = sessionNameInput.value.trim();
  if (!name) { sessionNameInput.focus(); return; }
  const tab = await getActiveTab();
  const session = await bgMessage({ type: 'START_SESSION', payload: { name, url: tab?.url || '' } });
  _currentSession = session;
  showSessionView(session);
  phCapture('session_started', { session_name: name, url: tab?.url || '' });
});

endBtn.addEventListener('click', async () => {
  const session = await bgMessage({ type: 'GET_SESSION' });
  if (session?.notes?.length > 0) {
    if (!confirm(`End session?\n\nYou have ${session.notes.length} note(s). Download your notes first if you haven't already.`)) return;
  }
  // Stop capture mode in content script if active
  if (_capturing) {
    const tab = await getActiveTab();
    if (tab?.id) try { await chrome.tabs.sendMessage(tab.id, { type: 'DEACTIVATE_CAPTURE' }); } catch {}
    setCapturing(false);
  }
  const noteCount = session?.notes?.length || 0;
  await bgMessage({ type: 'END_SESSION' });
  phCapture('session_ended', { note_count: noteCount });
  _currentSession = null;
  show(emptyStateEl);
  endBtn.hidden = true;
});

// ─── Capture mode ─────────────────────────────────────────────────────────────

function setCapturing(on) {
  _capturing = on;
  if (on) {
    activateBtn.innerHTML = '<span class="pp-live-dot"></span><span>End Capture Mode</span>';
    activateBtn.classList.add('pp-capturing');
  } else {
    activateBtn.innerHTML = '<i class="ti ti-crosshair"></i><span>Activate capture mode</span>';
    activateBtn.classList.remove('pp-capturing');
  }
}

activateBtn.addEventListener('click', async () => {
  const tab = await getActiveTab();
  if (!tab?.id) return;
  if (!isInjectablePage(tab.url)) { show(unavailableEl); return; }
  if (_capturing) {
    try { await chrome.tabs.sendMessage(tab.id, { type: 'DEACTIVATE_CAPTURE' }); } catch {}
    setCapturing(false);
    return;
  }
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'ACTIVATE_CAPTURE' });
    setCapturing(true);
  } catch {
    show(needsReloadEl);
  }
});

$('pp-reload-btn').addEventListener('click', async () => {
  const tab = await getActiveTab();
  if (tab?.id) { await chrome.tabs.reload(tab.id); show(emptyStateEl); }
});

// ─── Export ───────────────────────────────────────────────────────────────────

copyBtn.addEventListener('click', async () => {
  const session = await bgMessage({ type: 'GET_SESSION' });
  if (!session) return;
  const { markdown } = formatSession(session);
  await navigator.clipboard.writeText(markdown);
  phCapture('export_copied', { note_count: session.notes.length });
  const orig = copyBtn.innerHTML;
  copyBtn.textContent = '✓ Copied';
  setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
});

$('pp-share-btn').addEventListener('click', async () => {
  const shareBtn = $('pp-share-btn');
  const session = await bgMessage({ type: 'GET_SESSION' });
  if (!session || !session.notes.length) {
    shareBtn.textContent = 'No notes yet';
    setTimeout(() => { shareBtn.innerHTML = '<i class="ti ti-link"></i> Share'; }, 2000);
    return;
  }
  const orig = shareBtn.innerHTML;
  shareBtn.disabled = true;
  shareBtn.textContent = 'Sharing…';
  try {
    const id = await sbShareSession(session);
    if (!id) throw new Error('no id');
    const url = `https://getpincue.com/s/${id}`;
    await navigator.clipboard.writeText(url);
    phCapture('session_shared', { note_count: session.notes.length });
    shareBtn.textContent = '✓ Link copied';
    setTimeout(() => { shareBtn.innerHTML = orig; shareBtn.disabled = false; }, 3000);
  } catch {
    shareBtn.textContent = '⚠ Share failed';
    setTimeout(() => { shareBtn.innerHTML = orig; shareBtn.disabled = false; }, 2500);
  }
});

downloadBtn.addEventListener('click', async () => {
  const session = await bgMessage({ type: 'GET_SESSION' });
  if (!session) return;
  phCapture('export_downloaded', { note_count: session.notes.length });
  const { markdown, screenshots } = formatSession(session);
  const mdBlob = new Blob([markdown], { type: 'text/markdown' });
  const mdUrl = URL.createObjectURL(mdBlob);
  await chrome.downloads.download({ url: mdUrl, filename: sessionFilename(session), saveAs: true });
  URL.revokeObjectURL(mdUrl);
  for (const shot of screenshots) {
    const res = await fetch(shot.dataUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    await chrome.downloads.download({ url, filename: `screenshots/${shot.filename}` });
    URL.revokeObjectURL(url);
  }
});

// ─── Tab switch — reset capture state if new tab has no active capture ────────

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!_capturing) return;
  try {
    const res = await chrome.tabs.sendMessage(tabId, { type: 'IS_ACTIVE' });
    if (!res?.active) setCapturing(false);
  } catch {
    // New tab has no content script — capture mode can't be active there
    setCapturing(false);
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bgMessage(msg) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, response => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      if (response?.error) return reject(new Error(response.error));
      resolve('session' in (response || {}) ? response.session : response);
    });
  });
}

function esc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
