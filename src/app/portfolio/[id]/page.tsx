import { DesignPage } from '@/views/DesignPage';

export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { id: string } }) {
  return <DesignPage id={params.id} />;
}
