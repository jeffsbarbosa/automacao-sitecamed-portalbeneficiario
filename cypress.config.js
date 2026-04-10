const { defineConfig } = require("cypress");

module.exports = defineConfig({

  video: true, // 🔥 grava vídeo dos testes
  screenshotOnRunFailure: true, // 📸 print automático em falha
  
  e2e: {
    "baseUrl":"https://apps.camed.com.br/CamedSaudeServicos/Acesso/Login.aspx",
    "pageLoadTimeout":100000,
    "numTestsKeptInMemory": 0,
    "viewportWidth": 1280,
    "viewportHeight": 720,
    "defaultCommandTimeout": 20000,
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
