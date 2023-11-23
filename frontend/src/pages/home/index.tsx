import { useEffect, useRef, useState } from 'react';
import {
  Icon,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { StarIcon } from '@heroicons/react/24/solid';

// import * as DummyDashboards from '../../modules/superset/views/DummyDashboards.json';
import { embedDashboard } from '@superset-ui/embedded-sdk';

import Layout from '@/common/components/Dashboard/Layout';
import {
  useEnableDashboardMutation,
  useGenerateGuestTokenMutation,
  useGetDashboardsQuery,
  useGetFavoriteDashboardsQuery,
} from '@/modules/superset/superset';
import { Unauthorized } from '@/common/components/common/unauth';
import { usePermission } from '@/common/hooks/use-permission';
import getConfig from 'next/config';
import {
  DashboardListResult,
  FavoriteDashboardResult,
} from '@/modules/superset/interface';

type DashboardTabProps = {
  dashboard: DashboardListResult | null;
  onClick: (dashboardId: string) => void;
  isSelected: boolean;
};

type EmbeddedDashboardProps = {
  selectedDashboard: string | null;
};

const DashboardTab: React.FC<DashboardTabProps> = ({
  dashboard,
  onClick,
  isSelected,
}) => (
  <Tab
    key={dashboard?.id}
    onClick={() => onClick(String(dashboard?.id) || '')}
    defaultChecked={isSelected}
  >
    <Icon color="yellow" size="md" icon={StarIcon}></Icon>
    {dashboard?.dashboard_title}
  </Tab>
);

const EmbeddedDashboard: React.FC<EmbeddedDashboardProps> = ({
  selectedDashboard,
}) => {
  const [enableDashboard] = useEnableDashboardMutation();
  const [generateGuestToken] = useGenerateGuestTokenMutation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const embedDash = async () => {
      if (!selectedDashboard) {
        return;
      }

      const response = await enableDashboard(selectedDashboard);

      if (ref.current && response && 'data' in response) {
        const { uuid } = response.data.result;
        await embedDashboard({
          id: uuid,
          supersetDomain: `${publicRuntimeConfig.NEXT_PUBLIC_SUPERSET_URL}`,
          mountPoint: ref.current,
          fetchGuestToken: async () => {
            const res = await generateGuestToken(uuid);
            return 'data' in res ? res.data.token : '';
          },
          dashboardUiConfig: {
            hideTitle: true,
            hideTab: true,
            filters: {
              expanded: true,
              visible: true,
            },
          },
        });
      }
    };

    embedDash();
  }, [selectedDashboard]);

  return (
    <TabPanel>
      {selectedDashboard && (
        <div ref={ref} className="h-screen embed-iframe-container" />
      )}
    </TabPanel>
  );
};

const { publicRuntimeConfig } = getConfig();

export default function Home() {
  const { hasPermission } = usePermission();

  var { data, isError, isLoading } = useGetDashboardsQuery('');
  const dashboardIds = data?.result.map((dashboard: any) =>
    Number(dashboard?.id)
  ) || [0];

  var { data: favoriteStatus } = useGetFavoriteDashboardsQuery(dashboardIds);

  // Show only favorite Dashboards
  if (data && favoriteStatus) {
    // Extract the IDs of favorite dashboards
    const favoriteDashboardIds = favoriteStatus.result
      .filter((favorite: FavoriteDashboardResult) => favorite.value)
      .map((favorite: FavoriteDashboardResult) => Number(favorite.id));

    // Filter data.result to include only favorite dashboards
    data = {
      ...data,
      result: data.result.filter((dashboard: DashboardListResult) =>
        favoriteDashboardIds.includes(Number(dashboard.id))
      ),
    };
  }

  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(
    data?.result.length > 0 ? data?.result[0]?.id : null
  );

  // data = DummyDashboards;

  const handleTabClick = (dashboardId: string) => {
    setSelectedDashboard(dashboardId);
  };

  useEffect(() => {
    if (data?.result.length > 0) {
      handleTabClick(data.result[0].id);
    }
  }, [data]);

  if (!hasPermission('dashboard:read')) {
    return <Unauthorized />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading favorite dashboards</div>;
  }
  return (
    <Layout>
      <nav className="mb-5">
        <div>
          <h2 className="text-3xl">Favorite Dashboards</h2>
        </div>
      </nav>
      <TabGroup className="m-0">
        <TabList className="m-0" color="emerald" variant="solid">
          {data?.result.map((dashboard: any) => (
            <DashboardTab
              key={dashboard?.id}
              dashboard={dashboard}
              onClick={handleTabClick}
              isSelected={dashboard.id === selectedDashboard}
            ></DashboardTab>
          ))}
        </TabList>
        <TabPanels>
          {data?.result.map((dashboard: DashboardListResult) => (
            <EmbeddedDashboard
              key={dashboard.id}
              selectedDashboard={selectedDashboard}
            />
          ))}
        </TabPanels>
      </TabGroup>
    </Layout>
  );
}
