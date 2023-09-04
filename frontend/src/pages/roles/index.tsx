import Layout from '@/common/components/Dashboard/Layout';
import { Unauthorized } from '@/common/components/common/unauth';
import { usePermission } from '@/common/hooks/use-permission';
import { RoleList } from '@/modules/roles/views/List';

export const LoadRoles = () => {
  const { hasPermission } = usePermission();
  return (
    <Layout>
      {hasPermission('user:read') ? <RoleList /> : <Unauthorized />}
    </Layout>
  );
};

export default function Role() {
  return <LoadRoles />;
}
