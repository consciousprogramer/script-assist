import '@mantine/core/styles.css';
import 'react-loading-skeleton/dist/skeleton.css';
import '../index.css';
import { Suspense } from 'react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Router } from './setup/router/Router';
import { theme } from './setup/mantine/theme';
import AppFallback from './components/App/App.fallback';

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        retry: 2,
      },
    },
  });

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Suspense fallback={<AppFallback />}>
          <Router />
        </Suspense>
      </QueryClientProvider>
    </MantineProvider>
  );
}
