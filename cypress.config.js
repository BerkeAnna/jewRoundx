const { defineConfig } = require('cypress');
const synpressPlugins = require('@synthetixio/synpress/plugins');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Synpress pluginok hozzáadása a MetaMask támogatásához
      synpressPlugins(on, config);

      // Itt más Node események is hozzáadhatók
      return config;
    },
  },
});
