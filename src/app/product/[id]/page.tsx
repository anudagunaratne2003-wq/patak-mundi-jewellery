import { ProductPage } from '@/views/ProductPage';

export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { id: string } }) {
  return <ProductPage id={params.id} />;
}
