/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    NEXT_PRIVATE_BASE_URL: process.env.NEXT_PRIVATE_BASE_URL,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_MINIO_URL: process.env.NEXT_PUBLIC_MINIO_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_SUPERSET_URL: process.env.NEXT_PUBLIC_SUPERSET_URL,
    NEXT_PUBLIC_SUPERSET_GUEST_URL: process.env.NEXT_PUBLIC_SUPERSET_GUEST_URL,
    NEXT_PUBLIC_HOP_UI: process.env.NEXT_PUBLIC_HOP_UI,
    NEXT_PUBLIC_KEYCLOAK_URL: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
    NEXT_PUBLIC_KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  },
  images: {
    domains: [process.env.NEXT_MINIO_DOMAIN_NAME],
  },
};

module.exports = nextConfig;
