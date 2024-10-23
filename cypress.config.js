const { defineConfig } = require('cypress');
const synpressPlugins = require('@synthetixio/synpress/plugins');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      synpressPlugins(on, config);
      return config;
    },
  },
});
