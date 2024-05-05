import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      auth_base_url: 'https://keycloak.igad.local',
      auth_realm: 'regional-pandemic-analytics',
      auth_client_id: 'repan-staging',
    },
  },
});
