import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@task-forge/shared"],
  crossOrigin: "anonymous",
};

export default nextConfig;
