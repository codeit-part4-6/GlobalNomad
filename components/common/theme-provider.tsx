'use client';

import * as React from 'react';
const NextThemesProvider = dynamic(() => import('next-themes').then(e => e.ThemeProvider), {
  ssr: false,
});

// import { type ThemeProviderProps } from 'next-themes/dist/types'
import dynamic from 'next/dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ThemeProvider({children, ...props}: any) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" {...props}>
      {children}
    </NextThemesProvider>
  );
}
