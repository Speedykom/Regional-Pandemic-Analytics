import Layout from '@/common/components/Dashboard/Layout';
import { Unauthorized } from '@/common/components/common/unauth';
import { UserList } from '@/modules/user/views/List';
import { usePermission } from '@/common/hooks/use-permission';

export const LoadUsers = () => {
  const { hasPermission } = usePermission();
  return (
    <Layout>
      {hasPermission('user:read') ? <UserList /> : <Unauthorized />}
    </Layout>
  );
};

export default function User() {
  return <LoadUsers />;
}
