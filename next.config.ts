import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/engines'],

  typescript: {
    ignoreBuildErrors: true
  }
}

export default nextConfig
