import { Unauthorized } from '@/common/components/common/unauth';
import DashboardFrame from '@/common/components/Dashboard/DashboardFrame';
import { usePermission } from '@/common/hooks/use-permission';
import { ChartList } from '@/modules/superset/views/ListChart';

export default function Charts() {
  const { hasPermission } = usePermission();

  return (
    <DashboardFrame title="List of Chart(s)">
      {hasPermission('chart:read') ? <ChartList /> : <Unauthorized />}
    </DashboardFrame>
  );
}
