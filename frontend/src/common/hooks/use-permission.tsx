import { useSelector } from 'react-redux';
import { selectCurrentUserPermissions } from '@/modules/auth/auth';

export const usePermission = () => {
  const permissions = useSelector(selectCurrentUserPermissions);

  const hasPermission = (scope: string) => {
    return permissions.some((permission) => {
      return permission.scopes.includes(scope);
    });
  };

  return {
    permissions,
    hasPermission,
  };
};
