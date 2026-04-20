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
    baseUrl: "https://apps.camed.com.br/CamedSaudeServicos",

    pageLoadTimeout: 180000,
    defaultCommandTimeout: 100000,

    chromeWebSecurity: false,

    experimentalSessionAndOrigin: true,
    experimentalModifyObstructiveThirdPartyCode: true,

    numTestsKeptInMemory: 0,
    viewportWidth: 1280,
    viewportHeight: 720,

    retries: {
      runMode: 2,
      openMode: 0
    },

    // 🔥 AJUSTE PRINCIPAL (resolve seu travamento no visit)
    setupNodeEvents(on, config) {

      on('before:browser:launch', (browser, launchOptions) => {

        if (browser.family === 'chromium') {

          // 💥 evita ficar esperando conexões infinitas
          launchOptions.args.push('--disable-background-networking')

          // 💥 reduz interferência de serviços internos do Chrome
          launchOptions.args.push('--disable-features=NetworkService,NetworkServiceInProcess')

          // 💥 evita throttle/background freeze
          launchOptions.args.push('--disable-renderer-backgrounding')

        }

        return launchOptions
      })

      return config;
    },

    // 🔥 opcional mas altamente recomendado pro seu cenário
    blockHosts: [
      "*google-analytics.com",
      "*googletagmanager.com",
      "*doubleclick.net",
      "*privacytools.com.br"
    ]
  }
});