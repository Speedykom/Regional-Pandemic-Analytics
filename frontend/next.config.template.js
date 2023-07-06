/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    NEXT_PRIVATE_BASE_URL: "${NEXT_PRIVATE_BASE_URL}", // Pass through env variables
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_MINIO_URL: "${NEXT_PUBLIC_MINIO_URL}",
    NEXT_PUBLIC_BASE_URL: "${NEXT_PUBLIC_BASE_URL}",
    NEXT_PUBLIC_SUPERSET_URL: "${NEXT_PUBLIC_SUPERSET_URL}",
    NEXT_HOP_UI: "${NEXT_HOP_UI}",
  },
};

module.exports = nextConfig;
