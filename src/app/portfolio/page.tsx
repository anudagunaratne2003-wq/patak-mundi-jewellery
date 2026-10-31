import { PortfolioPage } from '@/views/PortfolioPage';

export const dynamic = 'force-dynamic';

export default function Page({ searchParams }: { searchParams: { category?: string; collection?: string } }) {
  return <PortfolioPage initialCategory={searchParams.category} initialCollection={searchParams.collection} />;
}
