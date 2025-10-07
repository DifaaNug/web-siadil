import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "randomuser.me",
      "statics.pupuk-kujang.co.id", // For employee profile pictures
    ],
  },
};

export default nextConfig;
