import { parseMenuFilters } from '@/entities/menu-item';
import { StopListPage } from '@/views/stop-list';

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const filters = parseMenuFilters({
    shop: params.shop,
    status: params.status,
  });

  return <StopListPage filters={filters} />;
}
