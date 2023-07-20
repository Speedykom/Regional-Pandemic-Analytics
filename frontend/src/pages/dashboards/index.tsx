import DashboardFrame from '@/common/components/Dashboard/DashboardFrame';
import { Unauthorised } from '@/common/components/common/unauth';
import { DashboardList } from '@/modules/superset/views/List';
import { usePermission } from '@/common/hooks/use-permission';

export default function Dashboard() {
  const { hasPermission } = usePermission();
  return (
    <DashboardFrame>
      {hasPermission('dashboard:read') ? <DashboardList /> : <Unauthorised />}
    </DashboardFrame>
  );
}
