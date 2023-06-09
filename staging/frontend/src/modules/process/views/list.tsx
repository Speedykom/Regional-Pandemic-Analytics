import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import React, { useState } from "react";
import { AddProcess } from "@/src/modules/process/views/add";
import { Button, Table } from "antd";
import LoadData from "@/components/TABS/upload";
import { ViewDag } from "@/components/Dag/ViewDag";
import { useProcessChainList } from "../hooks";
import { PlusOutlined } from "@ant-design/icons";
import { IGADTable } from "@/components/common/table";

export default function ProcessChinList() {
  const [addProcess, setProcess] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [dag, setDag] = useState<any>();

  const closeAdd = () => {
    setProcess(false);
  };

  const openAdd = () => {
    setProcess(true);
  };

  const closeLoad = () => {
    setOpen(false);
    setDag(null);
  };

  const closeView = () => {
    setView(false);
    setDag(null);
  };

  const viewProcess = (dag_id: any) => {
    setView(true);
    setDag(dag_id);
  };

  const loadData = (dag: any) => {
    setOpen(true);
    setDag(dag);
  };

  const { columns, rows, loading } = useProcessChainList({
    loadData,
    viewProcess,
  });

  return (
    <>
      <DashboardFrame>
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl">Process Chain</h2>
            <p className="my-2 text-gray-600">
              View and manage all process chains
            </p>
          </div>
          <div>
            <Button
              onClick={() => openAdd()}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add Process Chain
            </Button>
          </div>
        </div>
        <IGADTable columns={columns} rows={rows || []} loading={loading} />
        <LoadData onClose={closeLoad} state={open} dag={dag} />
        <ViewDag
          id={dag || ""}
          state={view}
          onClose={closeView}
          key="view-dag"
        />
        <AddProcess onClose={closeAdd} state={addProcess} />
      </DashboardFrame>
    </>
  );
}
