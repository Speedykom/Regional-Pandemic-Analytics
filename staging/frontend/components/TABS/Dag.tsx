import { useState } from "react";
import {
  useEditAccessMutation,
  useFindAllQuery,
  useRunProcessMutation,
} from "@/redux/services/process";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import LoadData from "./upload";
import { ShowMessage } from "../ShowMessage";
import { ViewDag } from "../Dag/ViewDag";
import Router from "next/router";

const EditButton = ({ id }: { id: string }) => {
  const [editAccess] = useEditAccessMutation();

  const [loading, setLoading] = useState(false);

  const edit = () => {
    setLoading(true);
    editAccess(id).then((res: any) => {
      if (res.error) {
        ShowMessage("error", res.error.message);
        return;
      }

      Router.push("/process-chains/hop");
    });
  };

  return (
    <Button
      loading={loading}
      onClick={() => edit()}
      className="dag-btn border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
    >
      Edit
    </Button>
  );
};

export default function Dag() {
  const { data, isLoading: loading } = useFindAllQuery();
  const [editAccess] = useEditAccessMutation();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [isRuning, setRuning] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [dag, setDag] = useState<any>();

  const [runPipeline] = useRunProcessMutation();

  const run = (dag_id: string) => {
    setRuning(true);
    runPipeline(dag_id)
      .then((res: any) => {
        if (res.error) {
          const { data } = res.error;
          const { message } = data;
          ShowMessage("success", message);
          return;
        }

        ShowMessage("success", res.data.message);
      })
      .finally(() => {
        setRuning(false);
        setDag(false);
      });
  };

  const closeLoad = () => {
    setOpen(false);
    setDag(null);
  };

  const closeView = () => {
    setView(false);
    setDag(null);
  };

  const viewDag = (dag_id: any) => {
    setView(true);
    setDag(dag_id);
  };

  const editDag = (dag_id: any) => {};

  const loadData = (dag: any) => {
    setOpen(true);
    setDag(dag);
  };

  const columns: ColumnsType<any> = [
    {
      dataIndex: "load",
      key: "load",
      render: (dag) => {
        return <Button onClick={() => loadData(dag)}>Load Data</Button>;
      },
      width: 100,
    },
    {
      title: "Dag",
      dataIndex: "dag_id",
      key: "dag_id",
    },
    {
      title: "Schedule",
      dataIndex: "schedule_interval",
      key: "schedule_interval",
      render: (schedule_interval) => {
        return <p>{schedule_interval.value}</p>;
      },
    },
    {
      title: "Next Run",
      dataIndex: "next_dagrun",
      key: "next_dagrun",
      render: (date) => {
        return <p>{new Date(date).toUTCString()}</p>;
      },
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (state) => {
        return <p>{state ? "Yes" : "No"}</p>;
      },
    },
    {
      key: "action",
      render: (dag) => (
        <div className="flex space-x-2 justify-end">
          <Button
            onClick={() => run(dag.dag_id)}
            loading={isRuning}
            className="dag-btn border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white focus:outline-none focus:bg-green-500 focus:text-white"
          >
            Run
          </Button>
          <Button
            onClick={() => viewDag(dag.dag_id)}
            className="dag-btn border-gray-500 text-gray-500 rounded-md hover:bg-gray-500 hover:text-white focus:outline-none focus:bg-gray-500 focus:text-white"
          >
            View
          </Button>
          <EditButton id={dag.dag_id} />
          <Button className="dag-btn border-purple-500 text-purple-500 rounded-md hover:bg-purple-500 hover:text-white focus:outline-none focus:bg-purple-500 focus:text-white">
            Pipeline
          </Button>
          <Button className="dag-btn border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white focus:outline-none focus:bg-red-500 focus:text-white">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="border bg-white rounded-md p-1 mt-10">
        <Table
          columns={columns}
          dataSource={data?.dags || []}
          loading={loading}
        />
      </div>
      <LoadData onClose={closeLoad} state={open} dag={dag} />
      <ViewDag id={dag || ""} state={view} onClose={closeView} key="view-dag" />
    </>
  );
}
