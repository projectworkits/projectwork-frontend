/* ──────────────────────────────────────────────────────────────────────────
   navbar.js · renderizza la barra di navigazione condivisa
   Chiamata: renderNavbar('home', user) dove user è il risultato di initApp().
   La pagina deve avere <body data-page="home|shop|mostra|azienda|admin|auth|none">
   ────────────────────────────────────────────────────────────────────────── */

function renderNavbar(activePage, user) {
  const role = getRole(user);
  const isAdminArea = role === 'admin' || role === 'collaborator';

  const pages = [
    { id: 'home',    label: 'Home',     href: 'index.html' },
    { id: 'shop',    label: 'Shop',     href: 'shop-index.html' },
    { id: 'mostra',  label: 'Galleria', href: 'mostra-index.html' },
    { id: 'azienda', label: 'Azienda',  href: 'azienda.html' },
  ];
  if (isAdminArea) {
    pages.push({ id: 'admin', label: 'Admin', href: 'admin-dashboard.html' });
  }

  const links = pages.map(p => `
    <li><a href="${p.href}" class="nav-link${activePage === p.id ? ' is-active' : ''}">${p.label}</a></li>
  `).join('');

  const rightSide = user
    ? `
      <span class="nav-user">${escapeHtml(user.username)}</span>
      <a href="#" class="nav-action" data-action="logout">Esci</a>
    `
    : `
      <a href="login" class="nav-action">Accedi</a>
    `;

  const html = `
    <nav class="nav" id="siteNav">
      <a class="nav-brand" href="index">
        <span class="nav-brand-mark">Doisneau</span>
        <span class="nav-brand-sub">Pordenone · 2026</span>
      </a>
      <ul class="nav-links">${links}</ul>
      <div class="nav-actions">${rightSide}</div>
      <button class="nav-burger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', html);

  const nav = document.getElementById('siteNav');
  const burger = nav.querySelector('.nav-burger');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  const logoutLink = nav.querySelector('[data-action="logout"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      try { await API.auth.logout(); } catch (_) { /* ignore */ }
      toast('Disconnessione effettuata', 'info');
      setTimeout(() => { location.href = 'index.html'; }, 500);
    });
  }
}

window.renderNavbar = renderNavbar;
