const axios = require('axios');
require('dotenv').config();
const { TOKENS } = require('./src/tokens');

async function verifyTokenContracts() {
  for (const token of TOKENS) {
    console.log(`Verifying ${token.symbol} at ${token.address}...`);

    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'proxy',
        action: 'eth_getCode',
        address: token.address,
        apikey: process.env.ETHERSCAN_API_KEY
      }
    });

    if (response.data.result === '0x') {
      console.error(`ERROR: ${token.symbol} contract not found`);
    } else {
      console.log(`\u2713 ${token.symbol} contract verified`);
    }
  }
}

verifyTokenContracts();
