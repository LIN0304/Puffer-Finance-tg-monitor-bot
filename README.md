# Ethereum Monitor Bot

This project is a multi-token Ethereum deposit monitoring bot with Telegram notification capabilities.

## Setup
1. Copy `.env.example` to `.env` and fill in your API credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the bot:
   ```bash
   npm start
   ```

### Frontend Web Server
Serve the simple frontend website with:
```bash
npm run web
```
The server listens on port `3000` by default and exposes `/api/tokens` and `/api/status` endpoints.


Run tests with `npm test`.
