import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import React, { useState, useEffect } from "react";
import { AddProcess } from "@/modules/process/views/add";
import { Button } from "antd";
import LoadData from "@/common/components/TABS/upload";
import { useProcessChainList } from "../hooks";
import { IGADTable } from "@/common/components/common/table";
import { ViewDag } from "./view";
import axios from "axios";
import { getData } from "@/common/utils";
import SelectHopModal from "@/common/components/SelectHopModal";

export default function ProcessChinList() {
  const [addProcess, setProcess] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [dag, setDag] = useState<any>();
  const [isShowHopModal, setIsShowHopModal] = useState(false);
  const [hopData, setHopData] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState<object>({});

  const closeAdd = () => {
    setProcess(false);
  };

  const openAdd = () => {
    setIsShowHopModal(true);
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

  // handle hop modal callback and hold the value returned
  const handleHopModalResponseData = (value: any) => {
    // if the value is an object that means it's a selected template
    if (typeof value === "object" && value !== null) {
      setSelectedTemplate(value);
      setIsShowHopModal(false);
      setProcess(true);
    } else {
      setIsShowHopModal(value);
    }
  };

  const [token, setToken] = useState<string>("");
  const fetchToken = async () => {
    try {
      const url = "/api/get-access-token/";
      const response = await getData(url);
      setToken(response?.accessToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchHops = async () => {
    // ${process.env.NEXT_PUBLIC_BASE_URL}
    try {
      const url = `http://localhost:8000/api/hop/`;
      await axios
        .get(url, {
          headers: {
            Authorization: `Token 25746e327dd2cc29ae304259574e381d9a334a39`,
            //Bearer ${token}
          },
        })
        .then((res) => {
          setHopData(res?.data?.data);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // fetchToken();
    fetchHops();
  }, []);

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
        <IGADTable columns={columns} rows={rows || []} loading={loading} />
        <LoadData onClose={closeLoad} state={open} dag={dag} />
        <ViewDag
          id={dag || ""}
          state={view}
          onClose={closeView}
          key="view-dag"
        />

        {/* hop modal */}
        <SelectHopModal
          openModal={isShowHopModal}
          parentCallback={handleHopModalResponseData}
          hopData={hopData}
        />

        <AddProcess
          onClose={closeAdd}
          state={addProcess}
          selectedTemplate={selectedTemplate}
        />
      </DashboardFrame>
    </>
  );
}
