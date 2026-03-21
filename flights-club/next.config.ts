import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler disabled — conflicts with Framer Motion animation lifecycle hooks
  reactCompiler: false,
};

export default nextConfig;
