/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Disable TypeScript checking during build for faster builds
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build for faster builds
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Increase build timeouts if builds are timing out
  experimental: {
    // Increase the timeout for type checking
    typedRoutes: false
  },
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
};

// This ensures the config is properly applied
const config = nextConfig;

export default config;
