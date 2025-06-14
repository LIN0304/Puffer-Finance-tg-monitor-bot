const TelegramBot = require('node-telegram-bot-api');

class TelegramNotifier {
  constructor(token, chatId) {
    this.bot = new TelegramBot(token, { polling: true });
    this.chatId = chatId;
    this.setupCommands();
  }

  setupCommands() {
    this.bot.onText(/\/status/, () => {
      this.sendStatus();
    });

    this.bot.onText(/\/tokens/, () => {
      this.sendTokenList();
    });

    this.bot.onText(/\/help/, () => {
      this.sendHelp();
    });
  }

  async sendDepositAlert(tokenInfo, transaction) {
    const message = `${tokenInfo.emoji} ${tokenInfo.symbol} DEPOSIT ALERT ${tokenInfo.emoji}\n\n` +
      `Amount: ${this.formatAmount(transaction.value, tokenInfo.decimals)} ${tokenInfo.symbol}\n` +
      `From: ${transaction.from}\n` +
      `To: ${transaction.to}\n` +
      `Transaction: https://etherscan.io/tx/${transaction.hash}\n` +
      `Block: ${transaction.blockNumber}\n` +
      `Timestamp: ${new Date(transaction.timeStamp * 1000).toLocaleString()}`;

    await this.bot.sendMessage(this.chatId, message);
  }

  sendStatus() {
    this.bot.sendMessage(this.chatId, 'Bot is running');
  }

  sendTokenList() {
    const tokens = require('./tokens').TOKENS.map(t => `${t.symbol} - ${t.address}`).join('\n');
    this.bot.sendMessage(this.chatId, `Monitored tokens:\n${tokens}`);
  }

  sendHelp() {
    this.bot.sendMessage(this.chatId, '/status - bot status\n/tokens - list tokens\n/help - help');
  }

  formatAmount(value, decimals) {
    return (value / Math.pow(10, decimals)).toFixed(6);
  }
}

module.exports = TelegramNotifier;
