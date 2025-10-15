/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        // pathname: "/**" // optional
      },
    ],
  },

  outputFileTracingRoot: __dirname,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://crud-backend-15ir.onrender.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
