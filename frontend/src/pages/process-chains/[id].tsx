import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import React from "react";
import Router from "next/router";
import { EditProcess } from "@/modules/process/views/edit";

export default function EditProcessChain() {
  return (
    <DashboardFrame title="Edit Process Chain" back onBackPress={() => {
      Router.back()
    }}>
      <EditProcess />
    </DashboardFrame>
  );
}
