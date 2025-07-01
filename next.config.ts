import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Monaco Editor Webpack Plugin
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'monaco-editor': '@monaco-editor/react'
      }
    }

    return config
  },
  // Mengoptimalkan bundle size dengan menambahkan external dependencies
  transpilePackages: ['@monaco-editor/react'],
  // Konfigurasi untuk menangani error Vercel Analytics
  experimental: {
    clientInstrumentationHook: false
  }
};

export default nextConfig;
