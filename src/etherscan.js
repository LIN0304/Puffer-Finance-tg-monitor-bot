const axios = require('axios');
const { RateLimiter, ConnectionManager } = require('./utils');

class EtherscanClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.etherscan.io/api';
    this.processedTransactions = new Set();
    this.rateLimiter = new RateLimiter(
      parseInt(process.env.MAX_RETRIES) || 3,
      parseInt(process.env.RETRY_DELAY) || 5000
    );
    this.connectionManager = new ConnectionManager();
  }

  async getTokenTransfers(tokenAddress, targetAddress, startBlock = 0) {
    const params = {
      module: 'account',
      action: 'tokentx',
      contractaddress: tokenAddress,
      address: targetAddress,
      startblock: startBlock,
      endblock: 'latest',
      sort: 'desc',
      apikey: this.apiKey
    };

    const fetchFn = async () => {
      const response = await axios.get(this.baseUrl, { params });
      return response.data.result || [];
    };

    try {
      return await this.rateLimiter.executeWithRetry(fetchFn);
    } catch (error) {
      const shouldRetry = await this.connectionManager.handleConnectionError(error, 'Etherscan');
      if (shouldRetry) {
        return this.getTokenTransfers(tokenAddress, targetAddress, startBlock);
      }
      throw new Error(`Etherscan API error: ${error.message}`);
    }
  }

  isNewTransaction(txHash) {
    if (this.processedTransactions.has(txHash)) {
      return false;
    }
    this.processedTransactions.add(txHash);
    return true;
  }
}

module.exports = EtherscanClient;
