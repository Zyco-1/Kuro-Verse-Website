import { Metadata, Viewport } from 'next';
import Providers from '@/components/layout/Providers';
import Navbar from '@/components/layout/Navbar';
import Background from '@/components/layout/Background';
import ProgressBar from '@/components/layout/ProgressBar';
import '@/app/globals.css';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'KuroVerse - Watch Anime for Free',
  description: 'Modern, fast, and sexy anime streaming.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#a3e635',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-primary selection:text-white bg-background text-foreground overflow-x-hidden min-h-screen flex flex-col">
        <Background />
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        <Navbar />
        <main className="flex-1 relative z-10">
          <Suspense fallback={<div className="h-screen bg-black" />}>
            <Providers>
              {children}
            </Providers>
          </Suspense>
        </main>
      </body>
    </html>
  );
}
