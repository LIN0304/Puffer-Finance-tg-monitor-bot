class RateLimiter {
  constructor(maxRetries = 3, retryDelay = 5000) {
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  async executeWithRetry(fn, context = null) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn.call(context);
      } catch (error) {
        lastError = error;

        if (error.response?.status === 429) {
          console.log(`Rate limit hit, waiting ${this.retryDelay}ms...`);
          await this.sleep(this.retryDelay * attempt);
        } else {
          throw error;
        }
      }
    }

    throw lastError;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class ConnectionManager {
  constructor() {
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  async handleConnectionError(error, service) {
    console.error(`Connection error for ${service}:`, error.message);

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`);
      await this.sleep(delay);
      return true; // Signal to retry
    }

    return false; // Max attempts reached
  }

  resetReconnectCounter() {
    this.reconnectAttempts = 0;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { RateLimiter, ConnectionManager };
