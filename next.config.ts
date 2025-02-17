import type {NextConfig} from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: false,
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Apply headers to all API routes
        source: '/api/:path*',
        headers: [
          {key: 'Access-Control-Allow-Credentials', value: 'true'},
          {key: 'Access-Control-Allow-Origin', value: '*'},
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript 오류를 무시하고 빌드 진행
  },
  optimization: {
    minimize: true, // 빌드 시 최소화
    splitChunks: {
      chunks: 'all', // 모든 chunk를 분할하여 번들 크기를 최적화
    },
    runtimeChunk: true, // 런타임 코드 분리
  },
};

export default bundleAnalyzer(nextConfig);
