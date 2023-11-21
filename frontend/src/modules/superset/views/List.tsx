import { useRouter } from 'next/router';
import { Card, Subtitle } from '@tremor/react';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

import { Icon } from '@tremor/react';
import { useTranslation } from 'react-i18next';
import {
  useGetDashboardsQuery,
  useGetFavoriteDashboardsQuery,
} from '../superset';
import { useState } from 'react';
// import * as DummyDashboards from './DummyDashboards.json';

export const DashboardList = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const [searchInput, setSearchInput] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);

  // eslint-disable-next-line no-console
  console.log(isFavorite);

  var { data } = useGetDashboardsQuery(searchInput);
  // data = DummyDashboards;

  const dashboardIds = data?.result.map((dashboard: any) =>
    Number(dashboard?.id)
  ) || [0];

  var { data: favoriteStatus } = useGetFavoriteDashboardsQuery(dashboardIds);

  const toggleFavorite = (dashboardId: number) => {
    // eslint-disable-next-line no-console
    console.log(dashboardId);
    setIsFavorite((prev) => !prev);
  };
  const getIsFavorite = (id: number) => {
    return favoriteStatus?.result.find((fav: any) => fav.id === id)?.value;
  };

  const embedDashboard = (id: number) => {
    router.push(`/dashboards/${id}`);
  };
  return (
    <div className="">
      <nav className="mb-5">
        <div>
          <h2 className="text-3xl">{t('supersetDashboards')}</h2>
          <p className="mt-2 text-gray-600">
            {t('dashboardListCreatedOnSuperset')}
          </p>
        </div>
      </nav>
      <input
        type="text"
        placeholder="Search for dashboards..."
        className="w-full border border-gray-300 rounded-md p-2 mb-3"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="flex flex-wrap -mx-2">
        {data?.result.map((data: any, index: any) => (
          <div
            key={index}
            className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/3 px-2 mb-4"
          >
            <Card
              className="bg-white h-96 cursor-pointer transition-transform transform hover:scale-105 focus:outline-none"
              decoration="top"
              decorationColor="emerald"
              onClick={() => embedDashboard(Number(data?.id))}
            >
              <div className="mb-5 h-72">
                <img
                  className="object-cover h-full"
                  src="/dashboard-card-fallback.svg"
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
          </div>
        ))}
      </div>
    </div>
  );
};
