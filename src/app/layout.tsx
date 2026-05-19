'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Background from '@/components/layout/Background';
import ProgressBar from '@/components/layout/ProgressBar';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import '@/app/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <title>KuroVerse - Watch Anime for Free</title>
        <meta name="description" content="Modern, fast, and sexy anime streaming." />
        <meta name="theme-color" content="#a3e635" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-primary selection:text-white">
        <QueryClientProvider client={queryClient}>
          <Suspense>
            <ProgressBar />
          </Suspense>
          <Background />
          <Navbar />
          <main className="pt-20 min-h-screen">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </main>
          {/* Footer or other global components */}
        </QueryClientProvider>
      </body>
    </html>
  );
}
