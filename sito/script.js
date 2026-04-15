function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nb-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('theme-toggle');
  
  // Attiva/disattiva la classe 'light-mode'
  body.classList.toggle('light-mode');
  
  // Cambia l'icona in base al tema attivo
  if (body.classList.contains('light-mode')) {
    btn.innerHTML = '☾'; // Luna per suggerire il ritorno al dark mode
    btn.setAttribute('title', 'Passa al tema scuro');
  } else {
    btn.innerHTML = '☀'; // Sole per suggerire il passaggio al light mode
    btn.setAttribute('title', 'Passa al tema chiaro');
  }
}
