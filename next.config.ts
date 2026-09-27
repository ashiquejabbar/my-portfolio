import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: let phones on the local Wi-Fi load the dev server (ignored in production builds)
  allowedDevOrigins: ["192.168.10.101", "192.168.137.1"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
