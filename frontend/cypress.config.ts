import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      auth_base_url: 'https://auth2.igad-health.eu',
      auth_realm: 'regional-pandemic-analytics',
      auth_client_id: 'frontend',
    },
  },
});
