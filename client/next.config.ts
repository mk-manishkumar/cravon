import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/become-delivery-agent",
        destination: "https://cravon-driver.vercel.app/register",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
