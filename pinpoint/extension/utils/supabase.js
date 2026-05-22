// Pincue — Supabase client (no bundler, raw REST API via fetch)

const SUPABASE_URL = 'https://lrlkptqzaddxskoikzqs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybGtwdHF6YWRkeHNrb2lrenFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODg5NzIsImV4cCI6MjA5NDc2NDk3Mn0.gF0IUWlY1kLZ5rw8PTx7WZjRiBDUlbzaQDj6Db_mLdM';
const AUTH_KEY = 'pinic:auth';

// ─── Headers ──────────────────────────────────────────────────────────────────

function anonHeaders() {
  return { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY };
}

function authHeaders(token) {
  return { ...anonHeaders(), 'Authorization': `Bearer ${token}` };
}

// ─── Token storage ────────────────────────────────────────────────────────────

async function getStored() {
  const r = await chrome.storage.local.get(AUTH_KEY);
  return r[AUTH_KEY] || null;
}

async function setStored(data) {
  await chrome.storage.local.set({ [AUTH_KEY]: data });
}

async function clearStored() {
  await chrome.storage.local.remove(AUTH_KEY);
}

function parseAuthResponse(data) {
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    user: { id: data.user.id, email: data.user.email }
  };
}

// ─── Token refresh ────────────────────────────────────────────────────────────

async function refreshToken(refreshToken) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: anonHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  if (!res.ok) { await clearStored(); return null; }
  const data = await res.json();
  const auth = parseAuthResponse(data);
  await setStored(auth);
  return auth;
}

// ─── Public auth API ──────────────────────────────────────────────────────────

export async function sbGetSession() {
  let stored = await getStored();
  if (!stored) return null;
  if (Date.now() > stored.expires_at - 60_000) {
    stored = await refreshToken(stored.refresh_token);
  }
  return stored;
}

export async function sbSignUp({ name, email, password }) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: anonHeaders(),
    body: JSON.stringify({ email, password, data: { name } })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Sign up failed');
  if (!data.access_token) {
    // Email confirmation pending — Supabase returns user but no token
    return { needsConfirmation: true, email };
  }
  const auth = parseAuthResponse(data);
  await setStored(auth);
  return auth;
}

export async function sbSignIn({ email, password }) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: anonHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Invalid email or password');
  const auth = parseAuthResponse(data);
  await setStored(auth);
  return auth;
}

export async function sbSignOut() {
  const stored = await getStored();
  if (stored) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: authHeaders(stored.access_token)
    }).catch(() => {});
  }
  await clearStored();
}

// ─── User profile ─────────────────────────────────────────────────────────────

export async function sbGetProfile() {
  const session = await sbGetSession();
  if (!session) return null;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/users?id=eq.${session.user.id}&select=*`,
    { headers: authHeaders(session.access_token) }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}

export async function sbUpdateProfile(fields) {
  const session = await sbGetSession();
  if (!session) return;
  await fetch(
    `${SUPABASE_URL}/rest/v1/users?id=eq.${session.user.id}`,
    {
      method: 'PATCH',
      headers: { ...authHeaders(session.access_token), 'Prefer': 'return=minimal' },
      body: JSON.stringify(fields)
    }
  );
}

// ─── Session sync (premium) ───────────────────────────────────────────────────

export async function sbSyncSession(session) {
  const auth = await sbGetSession();
  if (!auth) return;
  await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
    method: 'POST',
    headers: { ...authHeaders(auth.access_token), 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({
      id: session.id,
      user_id: auth.user.id,
      name: session.name,
      url: session.url,
      created_at: session.createdAt
    })
  });
}

export async function sbSyncNote(note, sessionId) {
  const auth = await sbGetSession();
  if (!auth) return;
  await fetch(`${SUPABASE_URL}/rest/v1/notes`, {
    method: 'POST',
    headers: { ...authHeaders(auth.access_token), 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({
      id: note.id,
      session_id: sessionId,
      user_id: auth.user.id,
      severity: note.severity,
      note: note.note,
      suggested_fix: note.suggestedFix,
      element: note.element,
      screenshot_data_url: note.screenshotDataUrl,
      created_at: note.element?.timestamp || new Date().toISOString()
    })
  });
}

export async function sbGetRemoteSessions() {
  const auth = await sbGetSession();
  if (!auth) return [];
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/sessions?user_id=eq.${auth.user.id}&select=*&order=created_at.desc`,
    { headers: authHeaders(auth.access_token) }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function sbShareSession(session) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/public_sessions`, {
    method: 'POST',
    headers: { ...anonHeaders(), 'Prefer': 'return=representation' },
    body: JSON.stringify({ session_data: session })
  });
  if (!res.ok) throw new Error('Could not share session');
  const rows = await res.json();
  return rows[0]?.id || null;
}

export async function sbGetSharedSession(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/public_sessions?id=eq.${encodeURIComponent(id)}&select=session_data`,
    { headers: anonHeaders() }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0]?.session_data || null;
}

export async function sbAddToWaitlist(email) {
  await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: 'POST',
    headers: { ...anonHeaders(), 'Prefer': 'resolution=ignore-duplicates' },
    body: JSON.stringify({ email })
  });
}

export async function sbGetRemoteNotes(sessionId) {
  const auth = await sbGetSession();
  if (!auth) return [];
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/notes?session_id=eq.${sessionId}&select=*&order=created_at.asc`,
    { headers: authHeaders(auth.access_token) }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function sbDeleteSession(sessionId) {
  const auth = await sbGetSession();
  if (!auth) return;
  await fetch(
    `${SUPABASE_URL}/rest/v1/sessions?id=eq.${sessionId}&user_id=eq.${auth.user.id}`,
    {
      method: 'DELETE',
      headers: { ...authHeaders(auth.access_token), 'Prefer': 'return=minimal' }
    }
  );
}
