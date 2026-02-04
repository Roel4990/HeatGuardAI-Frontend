import * as React from 'react';
import type { Viewport, Metadata } from 'next';

import '@/styles/global.css';
import { UserProvider } from '@/contexts/user-context';
import { AppQueryClientProvider } from '@/components/core/query-client-provider';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { getSiteURL } from "@/lib/get-site-url";

const siteUrl = getSiteURL()

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
  title: 'HeatGuard AI',
  description: 'AI 기반 폭염 취약지 쿨링포그 최적 배치 시스템',
  icons: {
    icon: '/assets/heatguardLogo.svg',
  },
	openGraph: {
		title: 'HeatGuard AI',
		description: 'AI 기반 폭염 취약지 쿨링포그 최적 배치 시스템',
		images: [
			{
				url: '/nomoreIcon.png',
				width: 1200,
				height: 630,
				alt: 'HeatGuard AI',
			}
		],
		type: 'website'
	}
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
          <AppQueryClientProvider>
            <UserProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </UserProvider>
          </AppQueryClientProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
