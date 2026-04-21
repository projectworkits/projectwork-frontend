/* ──────────────────────────────────────────────────────────────────────────
   footer.js · renderizza il footer condiviso
   ────────────────────────────────────────────────────────────────────────── */

function renderFooter() {
  const year = new Date().getFullYear();
  const html = `
    <footer class="footer">
      <a class="footer-brand" href="azienda.html">Silk &amp; Stack</a>
      <ul class="footer-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="mostra-index.html">Galleria</a></li>
        <li><a href="shop-index.html">Shop</a></li>
        <li><a href="azienda.html">Azienda</a></li>
      </ul>
      <span>© ${year} Mostra Doisneau — Pordenone</span>
    </footer>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

window.renderFooter = renderFooter;
