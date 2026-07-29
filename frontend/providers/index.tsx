'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import ThemeProviderComp from './theme';
import ReduxStore from './redux-store';
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ReduxStore>
        <ThemeProviderComp>{children}</ThemeProviderComp>
      </ReduxStore>
    </AppRouterCacheProvider>
  );
}
