import { Toaster } from '@audiph/ui/components/sonner';
import '@audiph/ui/styles.css';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quiz App',
  description: 'Quiz application built with Next.js and Audiph UI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
