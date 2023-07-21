import { useEffect, useRef } from 'react';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import DashboardFrame from '@/common/components/Dashboard/DashboardFrame';
import getConfig from 'next/config';
import { usePermission } from '@/common/hooks/use-permission';
import { Unauthorized } from '@/common/components/common/unauth';
import { useRouter } from 'next/router';
import { useEnableDashboardMutation, useGenerateGuestTokenMutation } from '@/modules/superset/superset';

const { publicRuntimeConfig } = getConfig();

export default function SupersetDashboard() {
  const router = useRouter();
  const id = router.query.id as string;
  const [enableDashboard] = useEnableDashboardMutation();
  const [generateGuestToken] = useGenerateGuestTokenMutation();
  const { hasPermission } = usePermission();
  let ref = useRef(null);

  const embedDash = async () => {
    const response = await enableDashboard(id);
    if (ref.current && response && 'data' in response) {
      const uuid = response.data.result.uuid;
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
    if (id) {
      embedDash();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!hasPermission('dashboard:read')) {
    return <Unauthorized />;
  }

  return (
    <DashboardFrame title={'Dashboard'}>
      <div ref={ref} className="h-screen embed-iframe-container" />
    </DashboardFrame>
  );
}
