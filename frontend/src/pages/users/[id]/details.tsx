import Layout from '@/common/components/Dashboard/Layout';
import { Unauthorized } from '@/common/components/common/unauth';
import { usePermission } from '@/common/hooks/use-permission';
import { UserDetails } from '@/modules/user/views/UserDetails';

export default function UserAdd() {
  const { hasPermission } = usePermission();
  return (
    <Layout>
      {hasPermission('user:read') ? <UserDetails /> : <Unauthorized />}
    </Layout>
  );
}
