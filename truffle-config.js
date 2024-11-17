require('babel-register');
require('babel-polyfill');
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
       from: "0x7C8476745912154a98a4aD354d3792b88dE1CF19"
    },
    loc_development_development: {
      network_id: "*",
      port: 8545,
      host: 'localhost'
    },
    conLoc: {
      network_id: "*",
      port: 9545,
      host: '127.0.0.1'
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
