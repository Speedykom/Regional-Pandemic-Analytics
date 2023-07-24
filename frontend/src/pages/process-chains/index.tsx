import { Unauthorized } from '@/common/components/common/unauth';
import DashboardFrame from '@/common/components/Dashboard/DashboardFrame';
import { usePermission } from '@/common/hooks/use-permission';
import ProcessChainList from '@/modules/process/views/list';
import React from 'react';

export default function ProcessChains() {
  const { hasPermission } = usePermission();
  return (
    <DashboardFrame>
      {hasPermission('process:read') ? <ProcessChainList /> : <Unauthorized />}
    </DashboardFrame>
  );
}
