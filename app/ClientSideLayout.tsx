'use client';

import {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {usePathname} from 'next/navigation';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';

export default function ClientSideLayout({children}: Readonly<{children: React.ReactNode}>) {
  const [queryClient, setQueryClient] = useState<QueryClient | null>(null);
  const pathname = usePathname();

  const hideFooter = pathname === '/mypage' || pathname === '/signin' || pathname === '/signup';

  const hideNavbar = pathname === '/login' || pathname === '/signin';

  useEffect(() => {
    setQueryClient(new QueryClient());
  }, []);

  if (!queryClient) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {!hideNavbar && <Navbar />}
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      {!hideFooter && <Footer />}
    </QueryClientProvider>
  );
}
