/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["lucide-react"], // add this
  images: {
    remotePatterns: [
      { hostname: "skinsight-ynov-dk.s3.eu-west-3.amazonaws.com" },
    ],
  },
};

module.exports = nextConfig;
