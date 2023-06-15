import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  useEditAccessMutation,
  useFindAllQuery,
  useRunProcessMutation,
} from "./process";
import { ShowMessage } from "@/common/components/ShowMessage";
import { useState } from "react";
import Router from "next/router";

interface Props {
  loadData: (id: string) => void;
  viewProcess: (id: string) => void;
}

const EditButton = ({ id }: { id: string }) => {
  const [editAccess] = useEditAccessMutation();

  const [loading, setLoading] = useState(false);

  const edit = () => {
    setLoading(true);
    editAccess(id).then((res: any) => {
      if (res.error) {
        ShowMessage("error", res.error.message);
        setLoading(false);
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

const RunButton = ({ id }: { id: string }) => {
  const [runPipeline] = useRunProcessMutation();
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    runPipeline(id)
      .then((res: any) => {
        if (res.error) {
          const { data } = res.error;
          const { message } = data;

          setLoading(false);
          ShowMessage("success", message);
          return;
        }

        ShowMessage("success", res.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Button
      loading={loading}
      onClick={() => run()}
      className="dag-btn border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white focus:outline-none focus:bg-green-500 focus:text-white"
    >
      Run
    </Button>
  );
};

export const useProcessChainList = ({ loadData, viewProcess }: Props) => {
  const { data: data, isLoading: loading } = useFindAllQuery();

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
        return <p>{schedule_interval}</p>;
      },
    },
    {
      title: "Next Run",
      dataIndex: "airflow",
      key: "next_run",
      render: (data) => {
        return (
          <p>
            {data
              ? new Date(data?.next_dagrun).toUTCString()
              : "Dag creation inprogress"}
          </p>
        );
      },
    },
    {
      title: "Active",
      dataIndex: "airflow",
      key: "is_active",
      render: (data) => {
        return (
          <p>
            {data ? (data.is_active ? "Yes" : "No") : "Dag creation inprogress"}
          </p>
        );
      },
    },
    {
      key: "action",
      render: (dag) => (
        <div className="flex space-x-2 justify-end">
          <RunButton id={dag.dag_id} />
          <Button
            onClick={() => viewProcess(dag.dag_id)}
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

  return { columns, rows: data?.dags || [], loading };
};
