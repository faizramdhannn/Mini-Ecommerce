'use client';

import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <html lang="en">
      <head>
        <title>Admin Dashboard - Magadir</title>
        <meta name="description" content="Admin Dashboard for Magadir E-Commerce" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #333',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}