'use client';

import { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className={`${theme} min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200`}>
      {children}
    </div>
  );
}
