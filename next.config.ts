import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Product photography is hotlinked from the brand's own site. Serving those
     * files directly (instead of through the server-side image optimizer) keeps
     * them rendering when the app runs somewhere that cannot reach the host —
     * including local previews — and avoids an extra proxy hop in production.
     */
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.inkotanyisince90.com" },
      { protocol: "https", hostname: "inkotanyisince90.com" },
    ],
  },
};

export default nextConfig;
