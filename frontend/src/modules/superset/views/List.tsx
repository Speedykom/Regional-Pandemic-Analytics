import { useTranslation } from 'react-i18next';
import { useGetDashboardsQuery } from '../superset';
import { useState } from 'react';
import { ListDashboardCard } from './list/ListDashboardCard';

export const DashboardList = () => {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState<string>('');

  let { data } = useGetDashboardsQuery(searchInput);

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
        placeholder={t('searchForDashboard')}
        className="w-full border border-gray-300 rounded-md p-2 mb-3"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="flex flex-wrap -mx-2">
        {data?.result.map((data: any, index: number) => (
          <div
            key={index}
            className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/3 px-2 mb-4"
          >
            <ListDashboardCard
              data={data as { id: string; dashboard_title: string }}
            ></ListDashboardCard>
          </div>
        ))}
      </div>
    </div>
  );
};
