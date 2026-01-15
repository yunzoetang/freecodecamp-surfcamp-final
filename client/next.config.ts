import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "enduring-birds-0783425995.media.strapiapp.com",
      },
    ],
  },
};

export default nextConfig;
