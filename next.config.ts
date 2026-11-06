import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.inkotanyisince90.com" },
      { protocol: "https", hostname: "inkotanyisince90.com" },
    ],
  },
};

export default nextConfig;
