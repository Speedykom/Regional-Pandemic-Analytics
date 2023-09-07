import Layout from '@/common/components/Dashboard/Layout';
import { Unauthorized } from '@/common/components/common/unauth';
import { usePermission } from '@/common/hooks/use-permission';
import { ThumbnailList } from '@/modules/superset/views/Thumbnails';

export default function Dashboard() {
  const { hasPermission } = usePermission();
  return (
    <Layout>
      {hasPermission('dashboard:read') ? <ThumbnailList /> : <Unauthorized />}
    </Layout>
  );
}
