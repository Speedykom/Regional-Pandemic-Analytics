import { Button, Popover } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  useDelProcessMutation,
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

const ViewButton = ({ id }: { id: string }) => {
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

      Router.push(`/process-chains/${id}`);
    });
  };

  return (
    <Button
      loading={loading}
      onClick={() => edit()}
      className="dag-btn border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
    >
      View
    </Button>
  );
};

const DelButton = ({ id }: { id: string }) => {
  const [delProcess] = useDelProcessMutation();

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(false);

  const del = () => {
    setLoading(true);
    delProcess(id)
      .then((res: any) => {
        if (res.error) {
          ShowMessage("error", res.error.message);
          return;
        }

        close();
      })
      .finally(() => setLoading(false));
  };

  const open = () => {
    setState(true);
  };

  const close = () => {
    setState(false);
  };

  return (
    <Popover
      content={
        <div>
          <p>
            Are you sure to delete <br /> this process?
          </p>
          <div className="flex border-t mt-2 items-center space-x-2 pt-2">
            <Button loading={loading} onClick={del} type="text">
              Yes
            </Button>
            <p>/</p>
            <Button onClick={close} type="text">
              No
            </Button>
          </div>
        </div>
      }
      trigger="click"
      open={state}
      onOpenChange={open}
    >
      <Button
        className="dag-btn border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white focus:outline-none focus:bg-red-500 focus:text-white"
      >
        Disable
      </Button>
    </Popover>
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

export const useProcessChainList = () => {
  const { data: data, isLoading: loading } = useFindAllQuery();

  const columns: ColumnsType<any> = [
    // {
    //   dataIndex: "load",
    //   key: "load",
    //   render: (dag) => {
    //     return <Button onClick={() => loadData(dag)}>Load Data</Button>;
    //   },
    //   width: 100,
    // },
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
          {dag.airflow ? <RunButton id={dag.dag_id} /> : null}
          {dag.airflow ? <ViewButton id={dag.dag_id} /> : null}
          <DelButton id={dag.dag_id} />
        </div>
      ),
    },
  ];

  return { columns, rows: data?.dags || [], loading };
};

export const useProcessDagRuns = () => {
  const { data: data, isLoading: loading } = useFindAllQuery();

  const columns: ColumnsType<any> = [
    {
      title: "Execution Date",
      dataIndex: "execution_date",
      key: "execution_date",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "end_date",
      dataIndex: "end_date",
      key: "end_date",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Run Type",
      dataIndex: "run_type",
      key: "run_type",
    },
    {
      title: "Last Scheduling Decision",
      dataIndex: "last_scheduling_decision",
      key: "last_scheduling_decision",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
  ];

  return { columns };
};
