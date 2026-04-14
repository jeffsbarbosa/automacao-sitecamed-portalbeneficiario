const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: true,

  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: false,
    json: true
  },

  e2e: {
    // 🚫 NÃO colocar baseUrl aqui

    pageLoadTimeout: 100000,
    defaultCommandTimeout: 30000,

    chromeWebSecurity: false,
    numTestsKeptInMemory: 0,

    viewportWidth: 1280,
    viewportHeight: 720,

    retries: 1,

    setupNodeEvents(on, config) {
      return config;
    },
  },
});