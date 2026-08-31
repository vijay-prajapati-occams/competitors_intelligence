'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface PageTitleContextValue {
  title: string | null;
  setTitle: (title: string | null) => void;
}

const PageTitleContext = createContext<PageTitleContextValue | undefined>(undefined);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  const value = useMemo(() => ({ title, setTitle }), [title]);
  return <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>;
}

export function usePageTitleContext(): PageTitleContextValue {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error('usePageTitleContext must be used within a PageTitleProvider');
  }
  return context;
}

export function usePageTitle(title: string): void {
  const { setTitle } = usePageTitleContext();

  useEffect(() => {
    setTitle(title);
    return () => setTitle(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);
}
