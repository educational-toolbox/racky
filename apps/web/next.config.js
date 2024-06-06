/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "skinsight-ynov-dk.s3.eu-west-3.amazonaws.com" },
    ],
  },
};

module.exports = nextConfig;
