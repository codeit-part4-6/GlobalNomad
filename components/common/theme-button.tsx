'use client';

import {Moon, Sun} from 'lucide-react';
import {useTheme} from 'next-themes';

export default function SelectingMode() {
  const {theme, setTheme} = useTheme();

  return (
    <button className="ml-0.5" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
