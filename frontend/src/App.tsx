import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppThemeProvider } from './providers/AppThemeProvider';
import { router } from './app/router';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

/**
 * Root App component.
 * - AppThemeProvider: Ant Design ConfigProvider + locale + tokens
 * - QueryClientProvider: React Query global client
 * - RouterProvider: React Router DOM
 */
function App() {
  return (
    <AppThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppThemeProvider>
  );
}

export default App;
