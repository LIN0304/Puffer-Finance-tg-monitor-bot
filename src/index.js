require('dotenv').config();
const EtherscanClient = require('./etherscan');
const TelegramNotifier = require('./telegram');
const { TOKENS } = require('./tokens');

class TokenMonitor {
  constructor(mode = 'full') {
    this.mode = mode;
    this.etherscan = new EtherscanClient(process.env.ETHERSCAN_API_KEY);
    this.telegram = new TelegramNotifier(
      process.env.TELEGRAM_BOT_TOKEN,
      process.env.CHAT_ID
    );
    this.pollingInterval = parseInt(process.env.POLLING_INTERVAL) || 60000;
    this.isRunning = false;
  }

  async start() {
    if (this.mode === 'full') {
      console.log('Starting token monitor in FULL mode...');
      await this.telegram.bot.sendMessage(
        this.telegram.chatId,
        '\ud83e\dd16 Token Monitor Bot Started'
      );
      this.isRunning = true;
      this.monitorLoop();
    } else {
      console.log('Token monitor started in ANALYSIS mode');
    }
  }

  async monitorLoop() {
    while (this.isRunning) {
      await this.checkAllTokens();
      await this.sleep(this.pollingInterval);
    }
  }

  async checkAllTokens() {
    const checks = TOKENS.map(token => this.checkToken(token));
    await Promise.all(checks);
  }

  async checkToken(tokenInfo) {
    try {
      const transfers = await this.etherscan.getTokenTransfers(
        tokenInfo.address,
        tokenInfo.address
      );

      for (const tx of transfers) {
        if (
          tx.to.toLowerCase() === tokenInfo.address.toLowerCase() &&
          this.etherscan.isNewTransaction(tx.hash)
        ) {
          await this.telegram.sendDepositAlert(tokenInfo, tx);
        }
      }
    } catch (error) {
      console.error(`Error checking ${tokenInfo.symbol}:`, error.message);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    this.isRunning = false;
    console.log('Token monitor stopped');
  }
}

const mode = process.env.NODE_ENV === 'analysis' ? 'analysis' : 'full';
const monitor = new TokenMonitor(mode);
monitor.start();

process.on('SIGINT', () => {
  monitor.stop();
  process.exit(0);
});
