import Layout from '@/common/components/Dashboard/Layout';
import React from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function ProcessChains() {
  return (
    <Layout>
      <iframe src={publicRuntimeConfig.NEXT_HOP_UI} />
    </Layout>
  );
}
