import DashboardFrame from '@/common/components/Dashboard/DashboardFrame';
import { usePermission } from '@/common/hooks/use-permission';
import DataList from '@/modules/data/views/List';

export default function DataPage() {
  const { hasPermission } = usePermission();
  return (
    <DashboardFrame title="List(s) of Uploaded files">
      {hasPermission('data:read') && <DataList />}
    </DashboardFrame>
  );
}
