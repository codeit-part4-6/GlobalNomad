import type {Metadata} from 'next';
import '@/styles/globals.css';
import Script from 'next/script';
import ClientSideLayout from './ClientSideLayout';
import {ThemeProvider} from '@/components/common/theme-provider';

export const metadata: Metadata = {
  title: {
    default: 'Global Nomad',
    template: '%s',
  },
  description: '나에게 꼭 맞는 체험상품 찾기',
  keywords: '이색체험, 인기체험, 체험상품, 체험후기, 체험상품예약, 체험상품추천',
  metadataBase: new URL('https://codeit-global-nomad.vercel.app'),
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`}
          strategy="beforeInteractive"
        />
      </head>
      <body className="max-w-full">
        <ThemeProvider>
          <ClientSideLayout>
            <main className="flex-grow">{children}</main>
          </ClientSideLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
