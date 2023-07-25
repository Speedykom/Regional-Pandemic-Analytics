import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import React from "react";
import Router from "next/router";
import getConfig from 'next/config'
 
const { publicRuntimeConfig } = getConfig()

export default function ProcessChains() {
  return (
    <DashboardFrame title="Hop Process Chains" back onBackPress={() => {
      Router.back()
    }}>
      <iframe src={publicRuntimeConfig.NEXT_HOP_UI} />
    </DashboardFrame>
  );
}
