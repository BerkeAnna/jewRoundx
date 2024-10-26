require('babel-register');
require('babel-polyfill');
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      //port: 7545,
      port: 7545,
      network_id: "*",
      from: "0x919cDDD1BAadEA2CC16d3986D49a63C2a518B4F1" //eredetileg az elsot választja a listából, de mivel nincs elég ethere, ezért másikat rögzítettem
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
