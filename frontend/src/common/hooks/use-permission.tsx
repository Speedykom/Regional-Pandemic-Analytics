import React, { useEffect, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { Permissions } from '@/modules/auth/interface';

export interface PermissionContextValue {
  permissions: Permissions;
  hasPermission: (scope: string) => boolean;
}

const PermissionContext = React.createContext<PermissionContextValue | null>(null);
PermissionContext.displayName = 'PermissionContext';

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const PermissionProvider = ({
  children,
}: AuthProviderProps): JSX.Element => {
  const [permissions, setPermissions] = useState<Permissions>([]);

  useEffect(() => {
    const perms = secureLocalStorage.getItem('permissions') as Permissions;
    setPermissions(perms || []);
  }, []);

  const hasPermission = (scope: string) => {
    return permissions.some((permission) => {
      return permission.scopes.includes(scope)
    })
  }

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        hasPermission
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = React.useContext(PermissionContext);
  if (!context) {
    throw new Error(`usePermission must be used within an PermissionContext provider`);
  }
  return context;
};
