'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface QueryClientProviderProps {
  children: React.ReactNode;
}

export function AppQueryClientProvider({ children }: QueryClientProviderProps): React.JSX.Element {
  const [queryClient] = React.useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
