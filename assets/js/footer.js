/* ──────────────────────────────────────────────────────────────────────────
   footer.js · renderizza il footer condiviso
   ────────────────────────────────────────────────────────────────────────── */

function renderFooter() {
  const year = new Date().getFullYear();
  const html = `
    <footer class="footer">
      <a class="footer-brand" href="azienda>Silk &amp; Stack</a>
      <ul class="footer-links">
        <li><a href="index>Home</a></li>
        <li><a href="mostra-index>Galleria</a></li>
        <li><a href="shop-index>Shop</a></li>
        <li><a href="azienda>Azienda</a></li>
      </ul>
      <span>© ${year} Mostra Doisneau — Pordenone</span>
    </footer>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

window.renderFooter = renderFooter;
