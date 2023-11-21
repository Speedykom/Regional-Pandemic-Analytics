import { useEffect, useRef, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import * as DummyDashboards from '../../modules/superset/views/DummyDashboards.json';
import { embedDashboard } from '@superset-ui/embedded-sdk';

import Layout from '@/common/components/Dashboard/Layout';
import {
  useEnableDashboardMutation,
  useGenerateGuestTokenMutation,
  useGetDashboardsQuery,
} from '@/modules/superset/superset';
import { Unauthorized } from '@/common/components/common/unauth';
import { usePermission } from '@/common/hooks/use-permission';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function Home() {
  const [enableDashboard] = useEnableDashboardMutation();
  const [generateGuestToken] = useGenerateGuestTokenMutation();
  const { hasPermission } = usePermission();
  const ref = useRef(null);

  var { data } = useGetDashboardsQuery('');

  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(
    null
  );

  data = DummyDashboards;

  const handleTabClick = (dashboardId: string) => {
    setSelectedDashboard(dashboardId);
  };

  const embedDash = async () => {
    if (!selectedDashboard) {
      return;
    }
    const response = await enableDashboard(selectedDashboard);
    if (ref.current && response && 'data' in response) {
      const { uuid } = response.data.result;
      await embedDashboard({
        id: uuid, // given by the Superset embedding UI
        supersetDomain: `${publicRuntimeConfig.NEXT_PUBLIC_SUPERSET_URL}`,
        mountPoint: ref.current, // html element in which iframe render
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

  useEffect(() => {
    if (selectedDashboard) {
      setSelectedDashboard(selectedDashboard);
    }
    embedDash();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDashboard]);

  if (!hasPermission('dashboard:read')) {
    return <Unauthorized />;
  }
  return (
    <Layout>
      <>
        <TabGroup>
          <TabList className="mt-8">
            {data?.result.map((dashboard: any) => (
              <Tab
                key={dashboard?.id}
                defaultValue={dashboard?.id}
                onClick={() => handleTabClick(dashboard.id)}
              >
                {dashboard?.dashboard_title}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {data?.result.map((dashboard: any) => (
              <TabPanel key={dashboard.id}>
                {dashboard?.id === selectedDashboard && (
                  <div ref={ref} className="h-screen embed-iframe-container" />
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </>
    </Layout>
  );
}
