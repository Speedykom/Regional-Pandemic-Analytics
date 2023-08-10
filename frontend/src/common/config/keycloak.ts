import { KeycloakInstance } from 'keycloak-js';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const Keycloak = typeof window !== 'undefined' ? require('keycloak-js') : null;

const keycloak =
  typeof window !== 'undefined'
    ? Keycloak({
        url: publicRuntimeConfig.NEXT_PUBLIC_KEYCLOAK_URL,
        realm: publicRuntimeConfig.NEXT_PUBLIC_KEYCLOAK_REALM,
        clientId: publicRuntimeConfig.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
      })
    : ({} as KeycloakInstance);

export default keycloak;
