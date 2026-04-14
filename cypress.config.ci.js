const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
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

    pageLoadTimeout: 120000,
    defaultCommandTimeout: 30000,

    chromeWebSecurity: false,
    numTestsKeptInMemory: 0,

    viewportWidth: 1280,
    viewportHeight: 720,

    retries: 2,

    setupNodeEvents(on, config) {
      return config;
    },
  },
});