import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use "@/styles/color_variables" as *;`,
  },
};

export default nextConfig;
