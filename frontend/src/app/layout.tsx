'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}