import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
