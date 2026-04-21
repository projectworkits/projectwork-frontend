/* ──────────────────────────────────────────────────────────────────────────
   app.js · bootstrap applicazione, helper ruoli/auth, toast, modal
   Ordine di caricamento: <script src="api.js"></script> prima di questo.
   ────────────────────────────────────────────────────────────────────────── */

/** Legge l'utente corrente dal backend. Ritorna null se non loggato. */
async function initApp() {
  try {
    return await API.users.me();
  } catch (_) {
    return null;
  }
}

function isLoggedIn(user) { return !!user; }

/** Ruolo dell'utente: 'admin' | 'collaborator' | 'user' | 'guest'. */
function getRole(user) {
  if (!user) return 'guest';
  if (user.admin === true)        return 'admin';
  if (user.collaborator === true) return 'collaborator';
  return 'user';
}

function isStaff(user) {
  const r = getRole(user);
  return r === 'admin' || r === 'collaborator';
}

/** Può il `current` modificare il `target` (altro utente)?
 *  Regola (README + conferma utente): solo gli admin possono modificare altri utenti;
 *  i collaboratori non possono modificare admin né altri collaboratori. */
function canManageUser(current, target) {
  if (!current || !target) return false;
  return getRole(current) === 'admin';
}

/** Redirect a login.html se non autenticato. Ritorna true se ok. */
function requireAuth(user) {
  if (user) return true;
  const from = encodeURIComponent(location.pathname + location.search);
  location.href = 'login.html?from=' + from;
  return false;
}

function requireStaff(user) {
  if (isStaff(user)) return true;
  location.href = 'index.html';
  return false;
}

function requireAdmin(user) {
  if (getRole(user) === 'admin') return true;
  location.href = 'index.html';
  return false;
}

/* ── UI: toast ─────────────────────────────────────────────────────────── */
function _ensureToastStack() {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  return stack;
}
function toast(message, type = 'info') {
  const stack = _ensureToastStack();
  const el = document.createElement('div');
  el.className = 'toast is-' + type;
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => el.remove(), 3600);
}

/* ── UI: modal di conferma ─────────────────────────────────────────────── */
function confirmModal(message, { title = 'Conferma', okLabel = 'Conferma', cancelLabel = 'Annulla', danger = false } = {}) {
  return new Promise((resolve) => {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3 class="modal-title">${title}</h3>
        <p class="modal-body">${message}</p>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-act="cancel">${cancelLabel}</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-act="ok">${okLabel}</button>
        </div>
      </div>`;
    const close = (value) => { backdrop.remove(); resolve(value); };
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop)            close(false);
      if (e.target.dataset.act === 'ok')    close(true);
      if (e.target.dataset.act === 'cancel') close(false);
    });
    document.body.appendChild(backdrop);
  });
}

/* ── helpers generici ──────────────────────────────────────────────────── */
function truncate(str, max) {
  if (!str) return '';
  return str.length <= max ? str : str.slice(0, max - 1) + '…';
}
function fmtPrice(n) {
  const num = Number(n) || 0;
  return '€' + num.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function qs(name) {
  return new URLSearchParams(location.search).get(name);
}
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
/** Normalizza il path di una foto ritornato dal backend in un URL servibile.
 *  Le foto vivono su /photos/<uuid> (volume condiviso). */
function photoUrl(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path)) return path;
  if (path.startsWith('/')) return path;
  return '/photos/' + path.replace(/^photos\//, '');
}
/* ── Mapping stato foto (backend usa int: 0/1/2) ───────────────────────── */
const PHOTO_STATE_KEYS   = ['available', 'booked', 'sold'];
const PHOTO_STATE_LABELS = { available: 'Disponibile', booked: 'Prenotato', sold: 'Venduto' };
function photoStateKey(state) {
  if (typeof state === 'number') return PHOTO_STATE_KEYS[state] || 'available';
  const s = String(state || '').toLowerCase();
  return PHOTO_STATE_KEYS.includes(s) ? s : 'available';
}
function photoStateLabel(state) { return PHOTO_STATE_LABELS[photoStateKey(state)]; }
function photoStateInt(key) { return Math.max(0, PHOTO_STATE_KEYS.indexOf(String(key).toLowerCase())); }

/* ── reveal on scroll (per sezioni con class .reveal) ──────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', initReveal);

window.initApp = initApp;
window.isLoggedIn = isLoggedIn;
window.getRole = getRole;
window.isStaff = isStaff;
window.canManageUser = canManageUser;
window.requireAuth = requireAuth;
window.requireStaff = requireStaff;
window.requireAdmin = requireAdmin;
window.toast = toast;
window.confirmModal = confirmModal;
window.truncate = truncate;
window.fmtPrice = fmtPrice;
window.qs = qs;
window.escapeHtml = escapeHtml;
window.photoUrl = photoUrl;
window.photoStateKey = photoStateKey;
window.photoStateLabel = photoStateLabel;
window.photoStateInt = photoStateInt;
