async function loadTokens() {
  try {
    const response = await fetch('/api/tokens');
    const data = await response.json();
    const list = document.getElementById('token-list');
    data.tokens.forEach(t => {
      const li = document.createElement('li');
      li.textContent = `${t.emoji} ${t.symbol} - ${t.address}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Failed to load tokens', err);
  }
}

document.addEventListener('DOMContentLoaded', loadTokens);
