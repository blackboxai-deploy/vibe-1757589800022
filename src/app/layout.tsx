import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UPSC Exam Portal - Complete Preparation Platform',
  description: 'AI-powered UPSC exam preparation with Prelims & Mains questions, flashcards, mind maps, and comprehensive analytics. Get ready for civil services with personalized study plans.',
  keywords: 'UPSC, IAS, civil services, exam preparation, prelims, mains, mock tests, flashcards, mind maps, AI learning',
  authors: [{ name: 'UPSC Portal Team' }],
  creator: 'UPSC Portal',
  publisher: 'UPSC Portal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://upsc-portal.vercel.app'),
  openGraph: {
    title: 'UPSC Exam Portal - Complete Preparation Platform',
    description: 'AI-powered UPSC exam preparation with comprehensive study tools',
    url: 'https://upsc-portal.vercel.app',
    siteName: 'UPSC Portal',
    type: 'website',
    images: [
      {
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6f65e5d5-1c9b-4390-b36f-de8461696ab2.png',
        width: 1200,
        height: 630,
        alt: 'UPSC Portal - AI-Powered Exam Preparation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UPSC Exam Portal - Complete Preparation Platform',
    description: 'AI-powered UPSC exam preparation with comprehensive study tools',
    images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/182ae1bf-e90a-4ca2-8b82-369dbb0ce868.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="application-name" content="UPSC Portal" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UPSC Portal" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
              <main className="relative">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}