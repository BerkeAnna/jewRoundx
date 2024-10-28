require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

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
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"] // Tömbben add meg a privát kulcsot
    }
  }
};