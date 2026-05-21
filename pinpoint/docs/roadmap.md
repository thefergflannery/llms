# Pincue — Roadmap

**Last updated:** 2026-05-21  
**Current version:** v1.0.0 (submitted to Chrome Web Store)  
**Live site:** getpincue.com

---

## Phase 1 — Core capture loop ✅ Complete (v1.0.0)

| Item | Status |
|------|--------|
| MV3 Chrome extension (sidePanel API) | ✅ Done |
| Element picker: hover highlight → click → annotate | ✅ Done |
| CSS selector generation (id → class → parent path) | ✅ Done |
| Screenshot capture + OffscreenCanvas bbox overlay | ✅ Done |
| Shadow DOM annotation panel (content.js) | ✅ Done |
| Note model: severity, text, suggested fix, element metadata | ✅ Done |
| Markdown export: copy to clipboard + download .md | ✅ Done |
| Session sharing: Supabase public_sessions → getpincue.com/s/{id} | ✅ Done |
| Session management: start, rename, end | ✅ Done |
| Note CRUD: create, edit inline, delete, filter by severity | ✅ Done |
| Note count pill (X/15) + capture disable at limit | ✅ Done |
| Supabase auth: sign up / sign in / sign out / token refresh | ✅ Done |
| PostHog analytics: anonymous → identified, 12 events | ✅ Done |
| Intro/onboarding screen (pinic:intro_seen) | ✅ Done |
| Session auto-clear on panel close (free users only) | ✅ Done |
| Website: getpincue.com (static HTML, Vercel) | ✅ Done |
| Shared session viewer: getpincue.com/s/{id} | ✅ Done |
| Privacy policy (GDPR-compliant, 15 sections) | ✅ Done |
| OG social share image + full meta tags | ✅ Done |
| Chrome Web Store zip (36.6 KB, 17 files) | ✅ Done |

---

## Phase 2 — Pro Tier + Billing 🔜 Next

**Goal:** Launch a paid Pro tier at €5/month. Chrome Web Store approval is the trigger.

### 2a. Stripe billing (unblocks everything else)

| Item | Notes |
|------|-------|
| Stripe product + price (€5/month recurring) | Set up in Stripe dashboard |
| Vercel Edge Function: Stripe webhook handler | `POST /api/stripe-webhook` → verifies signature → sets `users.plan = 'premium'` in Supabase via service role key |
| Supabase `users` table: add `stripe_customer_id` column | Migration needed |
| "Upgrade to Pro" button in extension account panel | Opens Stripe Checkout in new tab |
| Post-payment plan detection in extension | Poll `sbGetProfile()` on panel open; update `pinic:account` cache |
| Test mode end-to-end before going live | Use Stripe test card 4242 4242 4242 4242 |

### 2b. Note limit bypass (30 min once billing works)

| Item | Notes |
|------|-------|
| `saveNote()` in `background.js`: check plan before enforcing `NOTE_LIMIT` | Fetch `pinic:account` from storage; skip limit if `plan === 'premium'` |
| `sidepanel.js`: hide count pill and re-enable capture button for Pro users | Already has plan check pattern — just wire it up |

### 2c. Session cloud sync (already stubbed in supabase.js)

| Item | Notes |
|------|-------|
| `startSession()` → call `sbSyncSession()` if premium | Wire up in `background.js` |
| `saveNote()` → call `sbSyncNote()` if premium | Wire up in `background.js` |
| On panel open for Pro: restore active session from Supabase if no local session | Add restore logic to sidepanel init |
| Session list in sidepanel shows cloud sessions for Pro | `sbGetRemoteSessions()` already exists |
| Confirm Supabase `sessions` + `notes` tables exist with correct schema + RLS | Check / create via Supabase dashboard |

### 2d. Dashboard — getpincue.com/dashboard

| Item | Notes |
|------|-------|
| Auth wall: check Supabase session; redirect to login if not signed in | Cookie or localStorage token |
| Session list: cards with name, date, URL, note count | `sbGetRemoteSessions()` |
| Session detail: view notes inline, re-export markdown | Load `notes` table by session_id |
| Screenshots in dashboard | Stored as data URLs in Supabase — may need separate storage bucket for scale |
| Delete session | `sbDeleteSession()` already exists |
| Upgrade CTA if `plan === 'free'` | Banner at top of dashboard |

### 2e. Email onboarding (Resend)

| Item | Notes |
|------|-------|
| Welcome email on sign-up | Triggered from Supabase Auth webhook or Vercel function |
| Waitlist notification when Pro launches | Batch send to `waitlist` table emails |
| Pro confirmation email after successful payment | Triggered from Stripe webhook handler |

---

## Phase 3 — Collaboration 🔮 Future

| Item | Notes |
|------|-------|
| Multiple active sessions | Architectural change: `pinpoint:active` becomes an array; session switcher UI in sidepanel |
| Selective markdown export / Triage UI | Before export: Accept / Ignore / Reroute per note; `export-md.js` receives filtered array |
| Guest invite: time-limited share link | New `guest_sessions` table; token-based access; guest adds notes to shared session |
| Real-time client note feed | Supabase Realtime subscription to `notes` table filtered by session_id |
| Comment threads on shared sessions | Notes as parent; comments as child rows |
| Jira / Linear / GitHub Issues export | Map severity → priority; POST to target API with element + note |

---

## Website backlog

| Item | Priority |
|------|----------|
| Pricing section bg.png polish (check rendering across breakpoints) | Medium |
| `manifest.json` description update (Chrome Web Store short desc) | High — do before next CWS update |
| Dashboard page (`/dashboard`) — auth wall + session list | Phase 2 |
| Changelog page | Low |
| Terms of service page | Medium (before billing goes live) |

---

## Key architectural constraints (do not break)

- **No bundler** — extension loads unpacked; no build step
- **No framework in content.js** — vanilla JS only
- **Storage keys are fixed** — `pinic:*` and `pinpoint:*` namespaces; rename = breaking change for existing users
- **Screenshot decode** — always use `atob()`, never `fetch(data:URL)` in service worker
- **Canvas in service worker** — always `OffscreenCanvas`, never `document.createElement('canvas')`
- **Capture listeners** — added once in `_ppInit()`, gated by `_ppActive`; never add/remove in a cycle
- **Supabase + PostHog** — raw REST API, no SDK (CSP constraint)

---

## Build sequence recommendation

```
Stripe setup + webhook
    ↓
Note limit bypass (plan check in background.js)
    ↓
Session cloud sync wiring (already stubbed)
    ↓
Dashboard page (/dashboard)
    ↓
Email onboarding (Resend)
    ↓
[Pro launch]
    ↓
Multiple active sessions
    ↓
Triage export UI
    ↓
Guest invite + realtime feed
```
