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
};

export default nextConfig;
