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
    NEXT_HOP_UI: process.env.NEXT_HOP_UI,
  },
};

module.exports = nextConfig;
