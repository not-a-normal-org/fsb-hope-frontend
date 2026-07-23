import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler disabled — conflicts with Framer Motion animation lifecycle hooks
  reactCompiler: false,
  allowedDevOrigins: ['192.168.0.102'],
};

export default nextConfig;
