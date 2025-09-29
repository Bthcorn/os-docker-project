import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://api:8080/:path*`
      }
    ]
  }
};

module.exports = nextConfig;
