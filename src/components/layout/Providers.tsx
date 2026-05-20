'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '@/components/layout/Background';
import Navbar from '@/components/layout/Navbar';
import ProgressBar from '@/components/layout/ProgressBar';
import { Suspense } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
        <Suspense>
            <ProgressBar />
        </Suspense>
        <Background />
        <Navbar />
        <main className="pt-20 min-h-screen">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </main>
    </QueryClientProvider>
  );
}
