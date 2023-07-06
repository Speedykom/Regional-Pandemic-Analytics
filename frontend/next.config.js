/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    NEXT_PRIVATE_BASE_URL: "http://127.0.0.1:8000", // Pass through env variables
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_MINIO_URL: "http://localhost:9001",
    NEXT_PUBLIC_BASE_URL: "http://127.0.0.1:8000",
    NEXT_PUBLIC_SUPERSET_URL: "http://localhost:8883",
    NEXT_HOP_UI: "http://localhost:8882/ui",
  },
};

module.exports = nextConfig;
