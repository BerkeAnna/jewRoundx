require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16", // Kompatibilis a megadott pragma verzióval
      },
      {
        version: "0.8.0", // További újabb verziók, ha szükséges
      }
    ]
  },
  networks: {
    development: {
      url: "http://127.0.0.1:8545",
      accounts: ["0x06e3c3660325e7ea92a56a4c2aaa8f94f6d5e2a31760a58ffe24ca352c088c1f"] // Tömbben add meg a privát kulcsot
    }
  }
};
