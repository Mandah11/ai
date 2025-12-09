import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEW_PUBLIC_HF_TOKEN: process.env.NEW_PUBLIC_HF_TOKEN || "",
    HF_TOKEN: process.env.HF_TOKEN || "",
  },
};

export default nextConfig;
