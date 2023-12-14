const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '2pqwf7',
  chromeWebSecurity: false,
  nodeVersion: "system",
  defaultCommandTimeout: 8000,
  responseTimeout: 8000,
  pageLoadTimeout: 18000,
  taskTimeout: 10000,
  requestTimeout: 8000,
  viewportHeight: 1024,
  viewportWidth: 1280,
  videoUploadOnPasses: false,
  numTestsKeptInMemory: 10,

  env: {
    urlToTest:'http://localhost:3000/',
    viewports: ['macbook-15', "iphone-6"],
  },
  e2e: {
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:3000/",
    experimentalInteractiveRunEvents: true,
  },
});
