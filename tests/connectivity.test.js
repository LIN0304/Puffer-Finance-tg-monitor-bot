const axios = require('axios');
require('dotenv').config();

describe('API Connectivity Tests', () => {
  test('Etherscan API responds correctly', async () => {
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'stats',
        action: 'ethsupply',
        apikey: process.env.ETHERSCAN_API_KEY
      }
    });
    expect(response.data.status).toBe('1');
  });

  test('Telegram bot token is valid', async () => {
    const response = await axios.get(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`
    );
    expect(response.data.ok).toBe(true);
  });
});
