'use client';

import { ThemeProvider } from 'styled-components';
import { LoaderProvider, useLoader } from '@/context/spinner';
import { AuthProvider } from '@/context/auth';
import CacheProvider from '@/context/cache';
import { EntitiesProvider } from '@/context/entities';
import { CacheDebug } from '@/components/debug';
import Spinner from '@/components/spinner/spinner';
import StyledJsxRegistry from './registry';
import { App, GlobalStyle } from '@/app/style';
import { AnimatePresence, motion } from 'motion/react';
import { Suspense, useEffect } from 'react';
import { setupInterceptors } from '@/services/api';
import { ToastContainer } from 'react-toastify';

import {
  _breakpoints,
} from '@/assets/scss/variables';

const theme = {
  _breakpoints
};

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <LoaderProvider>
        <LoaderSetup />
        <CacheProvider>
          <AuthProvider>
            <EntitiesProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <StyledJsxRegistry>
                  <AnimatePresence
                    mode="wait"
                    initial={true}
                    onExitComplete={() => window.scrollTo(0, 0)}
                  >
                    <App id="primary">
                      <motion.div
                        className="min-h-screen flex flex-start flex-col"
                        initial={{ x: 0, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 0, opacity: 0 }}
                      >
                        {children}
                      </motion.div>
                      <Spinner />
                      <ToastContainer />
                      <CacheDebug />
                    </App>
                  </AnimatePresence>
                </StyledJsxRegistry>
              </Suspense>
            </EntitiesProvider>
          </AuthProvider>
        </CacheProvider>
      </LoaderProvider>
      <GlobalStyle />
    </ThemeProvider>
  );
}

function LoaderSetup() {
  const { setLoading } = useLoader();

  useEffect(() => {
    setupInterceptors(setLoading);
  }, [setLoading]);

  return null;
}
