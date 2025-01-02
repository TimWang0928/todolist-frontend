import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/:path*', // 代理请求到后端
        // basePath: false,
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;