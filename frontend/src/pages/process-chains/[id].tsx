import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import React from "react";
import Router from "next/router";
import { EditProcess } from "@/modules/process/views/edit";

type FormValues = {
  dagName: string;
  dagID: string;
  dagPath: string;
  scheduleInterval: string;
  parquetPath: string;
  dataSource: string;
};

export default function EditProcessChain() {
  return (
    <DashboardFrame title="Edit Process Chain" back onBackPress={() => {
      Router.back()
    }}>
      <EditProcess />
    </DashboardFrame>
  );
}
