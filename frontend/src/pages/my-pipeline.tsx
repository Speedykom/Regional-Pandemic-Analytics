import { Unauthorized } from '@/common/components/common/unauth';
import DashboardFrame from '@/common/components/Dashboard/DashboardFrame';
import { usePermission } from '@/common/hooks/use-permission';
import { MyPipelineList } from '@/modules/pipeline/views/list';

export default function Hops() {
  const { hasPermission } = usePermission();
  return (
    <DashboardFrame title="My Pipeline">
      {hasPermission('pipeline:read') ? <MyPipelineList /> : <Unauthorized />}
    </DashboardFrame>
  );
}
