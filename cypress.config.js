const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        /* ... */
      })
    },
  },
  screenshotsFolder: "tmp/cypress_screenshots",
  trashAssetsBeforeRuns: false,
  videosFolder: "tmp/cypress_videos",
})
