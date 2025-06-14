/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "mammoth"],
  },
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
  // Increase the maximum file size for uploads
  serverRuntimeConfig: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

module.exports = nextConfig;
