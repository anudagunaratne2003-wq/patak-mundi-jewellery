import type { Metadata } from 'next';
import { StoreProvider } from '@/store/StoreContext';
import { Shell } from '@/components/Shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lumière Jewels — Fine Jewellery & Bespoke Atelier',
  description:
    'Discover Lumière Jewels — handcrafted fine jewellery, bespoke atelier designs, and timeless collections. Complimentary worldwide shipping & returns.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
