import { Card, Icon, Subtitle } from '@tremor/react';
import {
  useAddDashboardToFavoritesMutation,
  useGetDashboardThumbnailQuery,
  useGetFavoriteDashboardsQuery,
  useRemoveDashboardFromFavoritesMutation,
} from '../../superset';

import { FavoriteDashboardResult } from '../../interface';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useRouter } from 'next/router';

export function ListDashboardCard({
  data,
}: {
  data: { id: string; dashboard_title: string } | undefined;
}) {
  const [addFavorite] = useAddDashboardToFavoritesMutation();
  const [removeFavorite] = useRemoveDashboardFromFavoritesMutation();
  const router = useRouter();
  var { data: favoriteStatus, refetch: refetchFavouriteDashboards } =
    useGetFavoriteDashboardsQuery(data?.id ? [Number(data.id)] : skipToken);

  const { data: thumbnailUrl } = useGetDashboardThumbnailQuery(
    data?.id ?? skipToken
  );

  const getIsFavorite = (id: number) => {
    return favoriteStatus?.result.find(
      (fav: FavoriteDashboardResult) => fav.id === id
    )?.value;
  };

  const toggleFavorite = async (dashboardId: number) => {
    const isFavorite = getIsFavorite(dashboardId);
    if (isFavorite) {
      await removeFavorite(dashboardId);
      refetchFavouriteDashboards();
    } else {
      await addFavorite(dashboardId);
      refetchFavouriteDashboards();
    }
  };

  const embedDashboard = (id: number) => {
    router.push(`/dashboards/${id}`);
  };

  return (
    <Card
      className="bg-white h-96 cursor-pointer transition-transform transform hover:scale-105 focus:outline-none"
      decoration="top"
      decorationColor="emerald"
      onClick={() => embedDashboard(Number(data?.id))}
    >
      <div className="mb-5 h-72 flex justify-center items-center overflow-hidden">
        <img
          className="object-cover w-full h-full"
          src={thumbnailUrl ?? '/dashboard-card-fallback.svg'}
          alt="icon"
        />
      </div>
      <div className="border-t flex justify-between items-center px-3 py-2">
        <div className="flex items-center">
          <Subtitle>{data?.dashboard_title}</Subtitle>
        </div>
        {getIsFavorite(Number(data?.id)) ? (
          <Icon
            color="yellow"
            size="md"
            icon={StarSolid}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the event from reaching the Card component
              toggleFavorite(Number(data?.id));
            }}
          />
        ) : (
          <Icon
            color="yellow"
            size="md"
            icon={StarOutline}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the event from reaching the Card component
              toggleFavorite(Number(data?.id));
            }}
          />
        )}
      </div>
    </Card>
  );
}
