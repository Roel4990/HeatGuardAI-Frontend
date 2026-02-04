import * as React from 'react';
import type { Viewport, Metadata } from 'next';

import '@/styles/global.css';
import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

export const metadata: Metadata = {
  title: 'HeatGuard AI',
  description: 'AI 기반 폭염 취약지 쿨링포그 최적 배치 시스템',
  icons: {
    icon: '/assets/heatguardLogo.svg',
  },
};

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <UserProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </UserProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
