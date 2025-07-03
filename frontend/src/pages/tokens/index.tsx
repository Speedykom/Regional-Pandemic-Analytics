import React from 'react';
import Layout from '@/common/components/Dashboard/Layout';
import { TokenList } from '@/modules/tokens/views/TokenList';

export default function TokenManagement() {
  return (
    <Layout>
      <TokenList />
    </Layout>
  );
}
