import { Metadata, Viewport } from 'next';
import Providers from '@/components/layout/Providers';
import '@/app/globals.css';

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
      <body className="antialiased selection:bg-primary selection:text-white bg-background text-foreground">
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
