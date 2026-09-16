import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import type { ReactNode } from 'react';

import { Providers } from './providers';

import './globals.css';

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-source-sans',
});

export const metadata: Metadata = {
  title: 'Стоп-лист кухни',
  description: 'Панель стоп-листа смены',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${sourceSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper font-sans text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
