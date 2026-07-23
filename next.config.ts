import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // reactCompiler disabled — conflicts with Framer Motion animation lifecycle hooks
  reactCompiler: false,
  allowedDevOrigins: ['192.168.0.102'],
};

// withPayload wires Payload's admin (/cms) and API (/cms-api) into the Next build.
export default withPayload(nextConfig);
