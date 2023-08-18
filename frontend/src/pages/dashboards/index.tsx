import Layout from '@/common/components/Dashboard/Layout';
import { Unauthorized } from '@/common/components/common/unauth';
import { DashboardList } from '@/modules/superset/views/List';
import { usePermission } from '@/common/hooks/use-permission';

export default function Dashboard() {
  const { hasPermission } = usePermission();
  return (
    <Layout>
      {hasPermission('dashboard:read') ? <DashboardList /> : <Unauthorized />}
    </Layout>
  );
}
