import DashboardFrame from '@/common/components/Dashboard/DashboardFrame';
import { Unauthorised } from '@/common/components/common/unauth';
import { UserList } from '@/modules/user/views/List';
import { usePermission } from '@/common/hooks/use-permission';

export const LoadUsers = () => {
  const { hasPermission } = usePermission();
  return (
    <DashboardFrame>
      {hasPermission('user:read') ? <UserList /> : <Unauthorised />}
    </DashboardFrame>
  );
};

export default function User() {
  return <LoadUsers />;
}
