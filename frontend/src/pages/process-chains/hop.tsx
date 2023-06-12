import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import React from "react";
import Router from "next/router";

type FormValues = {
  dagName: string;
  dagID: string;
  dagPath: string;
  scheduleInterval: string;
  parquetPath: string;
  dataSource: string;
};

export default function ProcessChains() {
  return (
    <DashboardFrame title="Hop Process Chains" back onBackPress={() => {
      Router.back()
    }}>
      <iframe src={process.env.NEXT_HOP_UI} />
    </DashboardFrame>
  );
}
