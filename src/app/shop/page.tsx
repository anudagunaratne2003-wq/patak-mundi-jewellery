import { ShopPage } from '@/views/ShopPage';

export const dynamic = 'force-dynamic';

export default function Page({ searchParams }: { searchParams: { category?: string; collection?: string } }) {
  return <ShopPage initialCategory={searchParams.category} initialCollection={searchParams.collection} />;
}
