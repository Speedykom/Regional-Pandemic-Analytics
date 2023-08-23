import { Unauthorized } from '@/common/components/common/unauth';
import Layout from '@/common/components/Dashboard/Layout';
import { usePermission } from '@/common/hooks/use-permission';
import { ChartList } from '@/modules/superset/views/ListChart';

export default function Charts() {
  const { hasPermission } = usePermission();

  return (
    <Layout>
      {hasPermission('chart:read') ? <ChartList /> : <Unauthorized />}
    </Layout>
  );
}
