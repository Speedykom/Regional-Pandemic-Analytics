import { defineConfig } from 'cypress';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      auth_base_url: publicRuntimeConfig.NEXT_PUBLIC_KEYCLOAK_URL,
      auth_realm: publicRuntimeConfig.NEXT_PUBLIC_KEYCLOAK_REALM,
      auth_client_id: publicRuntimeConfig.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    },
  },
});
