import type { Metadata } from 'next';
import { StoreProvider } from '@/store/StoreContext';
import { ProductsProvider } from '@/store/ProductsContext';
import { Shell } from '@/components/Shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pátak Mundi — Bespoke Jewellery, Designed With You',
  description:
    'Pátak Mundi is a bespoke jewellery atelier. Every piece is designed to order around the person who will wear it. Browse our portfolio of past commissions and start your own design with our designer.',
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
        <ProductsProvider>
          <StoreProvider>
            <Shell>{children}</Shell>
          </StoreProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
