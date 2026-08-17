import { CollectionPage } from '@/views/CollectionPage';

export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { collection: string } }) {
  return <CollectionPage collection={params.collection} />;
}
