// ABOUTME: Next.js configuration file for the conversation parser platform
// ABOUTME: Sets up basic configuration and path aliases for the application

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable TypeScript strict mode
  typescript: {
    // Dangerously allow production builds to successfully complete even if your project has type errors
    ignoreBuildErrors: false,
  },
  // Optimize images
  images: {
    domains: [],
  },
}

module.exports = nextConfig