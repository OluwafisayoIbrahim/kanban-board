// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://kanban-board-backend-3bfa.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
