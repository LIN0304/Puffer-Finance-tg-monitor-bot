const express = require('express');
const path = require('path');
const { TOKENS } = require('./tokens');

function createServer() {
  const app = express();

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/api/tokens', (req, res) => {
    res.json({ tokens: TOKENS.map(({ address, symbol, name, emoji }) => ({ address, symbol, name, emoji })) });
  });

  // Basic status endpoint
  app.get('/api/status', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  const app = createServer();
  app.listen(port, () => {
    console.log(`Web server running on port ${port}`);
  });
}

module.exports = { createServer };
