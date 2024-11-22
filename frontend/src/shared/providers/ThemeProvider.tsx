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
    <div className={`${theme} min-h-screen bg-light dark:bg-dark text-dark dark:text-light transition-colors duration-200`}>
      {children}
    </div>
  );
}
