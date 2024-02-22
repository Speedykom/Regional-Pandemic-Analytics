import {
  DashboardListResult,
  FavoriteDashboardResult,
} from '@/modules/superset/interface';
import {
  useGetDashboardsQuery,
  useGetFavoriteDashboardsQuery,
} from '@/modules/superset/superset';

import { EmbedDashboards } from '@/modules/superset/views/EmbedDashboards';
import Layout from '@/common/components/Dashboard/Layout';
import { Unauthorized } from '@/common/components/common/unauth';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { usePermission } from '@/common/hooks/use-permission';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function Home() {
  const { hasPermission } = usePermission();

  var { data } = useGetDashboardsQuery('');
  const dashboardIds = data?.result
    .map((d: any) => Number(d?.id))
    .filter((id: any) => !Number.isNaN(id));
  var { data: favoriteStatus } = useGetFavoriteDashboardsQuery(
    dashboardIds ?? skipToken
  );

  // Show only favorite Dashboards
  if (data && favoriteStatus) {
    // Extract the IDs of favorite dashboards
    const favoriteDashboardIds = favoriteStatus?.result
      .filter((favorite: FavoriteDashboardResult) => favorite?.value)
      .map((favorite: FavoriteDashboardResult) => Number(favorite?.id));

    // Filter data.result to include only favorite dashboards
    data = {
      ...data,
      result: data?.result.filter((dashboard: DashboardListResult) =>
        favoriteDashboardIds.includes(Number(dashboard.id))
      ),
    };
  }

  if (!hasPermission('dashboard:read')) {
    return <Unauthorized />;
  }

  return (
    <Layout>
      <nav className="mb-5">
        <div>
          <h2 className="text-3xl">Favorite Dashboards</h2>
        </div>
      </nav>
      <EmbedDashboards
        data={data?.result ?? ([] as DashboardListResult[])}
        supersetBaseUrl={publicRuntimeConfig.NEXT_PUBLIC_SUPERSET_GUEST_URL}
      />
    </Layout>
  );
}
