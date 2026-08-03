import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import { CustomThemeProvider } from './theme.tsx';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/index.ts';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
        <CustomThemeProvider>
          <CssBaseline />
          <App />
        </CustomThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Provider>
)
