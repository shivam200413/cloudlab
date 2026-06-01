/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return [
      { source: '/api/:path*', destination: `${apiUrl}/api/:path*` },
      { source: '/proxy/:path*', destination: `${apiUrl}/proxy/:path*` }
    ];
  }
};
module.exports = nextConfig;
