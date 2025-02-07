import Footer from '@/components/common/footer';
import {ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <div className="bg-black-400 min-h-740pxr">
      {children}
      <Footer />
    </div>
  );
}
