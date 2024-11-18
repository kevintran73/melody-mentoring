const { defineConfig } = require('cypress');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  env: {
    MAILSLURP_API_KEY: process.env.MAILSLURP_API_KEY,
  },

  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});
