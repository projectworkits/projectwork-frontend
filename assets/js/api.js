/* ──────────────────────────────────────────────────────────────────────────
   api.js · wrapper fetch per il REST backend
   Convenzione backend (README):
     - Cookie HttpOnly 'access_token' e 'refresh_token' gestiti dal server
     - Necessario credentials: 'include' su ogni chiamata
     - 200 OK, 201 Created, 204 No Content, 400 BadRequest, 401 Unauthorized
   Uso:
     API.auth.login(username, password)
     API.products.list()
     API.photos.book(imageId, userId)
   ────────────────────────────────────────────────────────────────────────── */

const API_BASE = '/api';

async function _request(path, opts = {}) {
  const isForm = opts.body instanceof FormData;
  const headers = { ...(opts.headers || {}) };
  if (!isForm && opts.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(API_BASE + path, {
    credentials: 'include',
    ...opts,
    headers,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const text = await res.text();
      if (text) message = text;
    } catch (_) { /* ignore */ }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

const API = {
  auth: {
    login(username, password) {
      return _request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    },
    refresh()  { return _request('/auth/refresh'); },
    logout()   { return _request('/auth/logout'); },
  },

  users: {
    register(payload) {
      // payload: { username, password, email }
      return _request('/users/register', { method: 'POST', body: JSON.stringify(payload) });
    },
    me()         { return _request('/users/user'); },
    list()       { return _request('/users'); },
    get(id)      { return _request('/users/' + id); },
    update(user) { return _request('/users', { method: 'PUT', body: JSON.stringify(user) }); },
    delete(id)   { return _request('/users/' + id, { method: 'DELETE' }); },
    opCollaborator(id)   { return _request('/users/opCollaborator/'   + id, { method: 'PUT' }); },
    deopCollaborator(id) { return _request('/users/deopCollaborator/' + id, { method: 'PUT' }); },
  },

  products: {
    list()          { return _request('/products'); },
    get(id)         { return _request('/products/' + id); },
    create(product) { return _request('/products', { method: 'POST', body: JSON.stringify(product) }); },
    update(product) { return _request('/products', { method: 'PUT',  body: JSON.stringify(product) }); },
    delete(id)      { return _request('/products/' + id, { method: 'DELETE' }); },
    sell(id, qty)         { return _request('/products/sell/'         + id + '/' + qty, { method: 'PUT' }); },
    addAvailable(id, qty) { return _request('/products/addAvailable/' + id + '/' + qty, { method: 'PUT' }); },
  },

  photos: {
    list()                { return _request('/photos'); },
    filter(state)         { return _request('/photos/filter/' + state); },
    get(id)               { return _request('/photos/' + id); },
    upload(formData)      { return _request('/photos/upload', { method: 'POST', body: formData }); },
    update(photo)         { return _request('/photos', { method: 'PUT', body: JSON.stringify(photo) }); },
    delete(id)            { return _request('/photos/' + id, { method: 'DELETE' }); },
    book(imgId, userId)   { return _request('/photos/book/'    + imgId + '/' + userId, { method: 'PUT' }); },
    unbook(imgId)         { return _request('/photos/unbook/'  + imgId, { method: 'PUT' }); },
    setSold(imgId)        { return _request('/photos/setsold/' + imgId, { method: 'PUT' }); },
  },
};

window.API = API;
