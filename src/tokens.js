module.exports = {
  TOKENS: [
    {
      address: process.env.CARROT_TOKEN_ADDRESS,
      symbol: 'CARROT',
      name: 'CARROT Token',
      emoji: '\ud83e\udd55',
      decimals: 18
    },
    {
      address: process.env.PUFFER_TOKEN_ADDRESS,
      symbol: 'PUFFER',
      name: 'Puffer Finance Token',
      emoji: '\ud83d\udc21',
      decimals: 18
    },
    {
      address: process.env.PUFETH_TOKEN_ADDRESS,
      symbol: 'pufETH',
      name: 'Puffer ETH',
      emoji: '\ud83d\udc8e',
      decimals: 18
    }
  ]
};
