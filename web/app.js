// ========== Theme Toggle ==========
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// Load saved theme
(() => {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

// ========== Fetch Bot Stats (only on home page) ==========
async function fetchStats() {
  if (!document.getElementById('uptime')) return;
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    document.getElementById('uptime').textContent = data.uptime;
    document.getElementById('users').textContent = data.users;
    document.getElementById('botStatus').textContent = data.status || 'Online';
  } catch {
    document.getElementById('botStatus').textContent = 'Offline';
  }
}

setInterval(fetchStats, 10000);
fetchStats();
