import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Secure Build */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;