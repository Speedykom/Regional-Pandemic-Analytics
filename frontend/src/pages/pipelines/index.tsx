import { Unauthorized } from '@/common/components/common/unauth';
import Layout from '@/common/components/Dashboard/Layout';
import { usePermission } from '@/common/hooks/use-permission';
import { MyPipelines } from '@/modules/pipeline/views/list';

export default function Hops() {
  const { hasPermission } = usePermission();
  return (
    <Layout>
      {hasPermission('pipeline:read') ? <MyPipelines /> : <Unauthorized />}
    </Layout>
  );
}
