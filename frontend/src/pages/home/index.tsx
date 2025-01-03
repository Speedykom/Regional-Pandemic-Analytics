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
import { useTranslation } from 'react-i18next';

const { publicRuntimeConfig } = getConfig();

export default function Home() {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();

  const { data: data, isLoading: isLoadingDashboards } =
    useGetDashboardsQuery('');
  const dashboardIds = data?.result
    .map((d: any) => Number(d?.id))
    .filter((id: any) => !Number.isNaN(id));
  const { data: favoriteStatus, isLoading: isLoadingFavorites } =
    useGetFavoriteDashboardsQuery(dashboardIds ?? skipToken);

  const favoriteDashboardIds = favoriteStatus?.result
    .filter((favorite: FavoriteDashboardResult) => favorite?.value)
    .map((favorite: FavoriteDashboardResult) => Number(favorite?.id));
  const favoriteData =
    data && favoriteStatus
      ? {
          ...data,
          result: data?.result.filter((dashboard: DashboardListResult) =>
            favoriteDashboardIds.includes(Number(dashboard.id))
          ),
        }
      : data ?? {};

  if (isLoadingDashboards || isLoadingFavorites) {
    return <div>Loading...</div>;
  }

  if (!hasPermission('dashboard:read')) {
    return <Unauthorized />;
  }

  return (
    <Layout>
      <nav className="mb-5">
        <div>
          <h2 className="text-3xl">{t('home.favorite_dashboard')}</h2>
        </div>
      </nav>
      <EmbedDashboards
        data={favoriteData.result ?? ([] as DashboardListResult[])}
        supersetBaseUrl={publicRuntimeConfig.NEXT_PUBLIC_SUPERSET_GUEST_URL}
      />
    </Layout>
  );
}
