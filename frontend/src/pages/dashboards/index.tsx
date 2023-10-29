import Layout from '@/common/components/Dashboard/Layout';
import { Unauthorized } from '@/common/components/common/unauth';
import { ThumbnailList } from '@/modules/superset/views/Thumbnails';
import { usePermission } from '@/common/hooks/use-permission';

export default function Dashboard() {
  const { hasPermission } = usePermission();
  return (
    <Layout>
      {hasPermission('dashboard:read') ? <ThumbnailList /> : <Unauthorized />}
    </Layout>
  );
}
