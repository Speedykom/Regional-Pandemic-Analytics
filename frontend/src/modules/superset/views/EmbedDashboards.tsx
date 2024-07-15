import {
  Callout,
  Card,
  Icon,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from '@tremor/react';
import { DashboardListResult } from '../interface';
import { ExclamationCircleIcon, StarIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import {
  useEnableDashboardMutation,
  useGenerateGuestTokenMutation,
} from '../superset';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { useTranslation } from 'react-i18next';

type EmbeddedDashboardProps = {
  selectedDashboard: string | null;
  supersetBaseUrl: string;
};

type DashboardTabProps = {
  dashboard: DashboardListResult | null;
  onClick: (dashboardId: string) => void;
  isSelected: boolean;
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
  supersetBaseUrl,
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
          supersetDomain: supersetBaseUrl,
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
        <div
          ref={ref}
          className="h-screen embed-iframe-container"
          style={{ height: '100%', width: '100%' }}
        />
      )}
    </TabPanel>
  );
};

export const EmbedDashboards = (inputs: {
  data: DashboardListResult[];
  supersetBaseUrl: string;
}) => {
  return (
    <>
      {inputs.data.length ? (
        <ShowEmbeddedDashboards
          data={inputs.data}
          supersetBaseUrl={inputs.supersetBaseUrl}
        ></ShowEmbeddedDashboards>
      ) : (
        <NoEmbeddedDashboards></NoEmbeddedDashboards>
      )}
    </>
  );
};

const ShowEmbeddedDashboards = (inputs: {
  data: DashboardListResult[];
  supersetBaseUrl: string;
}) => {
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(
    inputs.data[0]?.id.toString() ?? null
  );

  const handleTabClick = (dashboardId: string) => {
    setSelectedDashboard(dashboardId);
  };

  useEffect(() => {
    if (inputs.data.length) {
      handleTabClick(
        selectedDashboard ? selectedDashboard : inputs.data[0].id.toString()
      );
    }
  }, [inputs.data]);

  return (
    <TabGroup className="m-0">
      <TabList className="m-0" color="emerald" variant="solid">
        {inputs.data.map((dashboard: any) => (
          <DashboardTab
            key={dashboard.id}
            dashboard={dashboard}
            onClick={handleTabClick}
            isSelected={dashboard.id === selectedDashboard}
          ></DashboardTab>
        ))}
      </TabList>
      <TabPanels>
        {inputs.data?.map((dashboard: DashboardListResult) => (
          <EmbeddedDashboard
            supersetBaseUrl={inputs.supersetBaseUrl}
            key={dashboard.id}
            selectedDashboard={selectedDashboard}
          />
        ))}
      </TabPanels>
    </TabGroup>
  );
};

export const NoEmbeddedDashboards = () => {
  const { t } = useTranslation();
  return (
    <>
      <Card className="w-full">
        <Text>{t('home.favorite_dashboard')}</Text>
        <Callout
          className="h-12 mt-4"
          title={t('home.no_fav_dashboards_msg')}
          icon={ExclamationCircleIcon}
          color="rose"
        ></Callout>
      </Card>
    </>
  );
};
