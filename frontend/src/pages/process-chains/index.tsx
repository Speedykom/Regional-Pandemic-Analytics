import { Unauthorized } from '@/common/components/common/unauth';
import Layout from '@/common/components/Dashboard/Layout';
import { usePermission } from '@/common/hooks/use-permission';
import ProcessChainList from '@/modules/process/views/list';
import React from 'react';

export default function ProcessChains() {
  const { hasPermission } = usePermission();
  return (
    <Layout>
      {hasPermission('process:read') ? <ProcessChainList /> : <Unauthorized />}
    </Layout>
  );
}
