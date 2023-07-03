import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import React, { useState } from "react";
import { AddProcess } from "@/modules/process/views/add";
import { Button } from "antd";
import { useProcessChainList } from "../hooks";
import { IGADTable } from "@/common/components/common/table";
import { ProcessCard } from "../components/process-card";

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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl">Process Chain</h2>
            <p className="my-2 text-gray-600">
              View and manage all process chains
            </p>
          </div>
          <div>
            <Button onClick={() => openAdd()} type="primary" size="large">
              Add Process Chain
            </Button>
          </div>
        </div>
        {/* <IGADTable columns={columns} rows={rows || []} loading={loading} /> */}
        <div className="mt-5">
          {rows.map((process) => (
            <ProcessCard process={process} key={process.id} />
          ))}
        </div>

        <AddProcess onClose={closeAdd} state={addProcess} />
      </DashboardFrame>
    </>
  );
}
