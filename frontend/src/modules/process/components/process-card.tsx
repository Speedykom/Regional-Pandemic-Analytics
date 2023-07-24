import { ShowMessage } from "@/common/components/ShowMessage";
import { Button, Popover, Steps } from "antd";
import {
  BiChart,
  BiChevronDown,
  BiChevronUp,
  BiGitMerge,
  BiTable,
} from "react-icons/bi";
import {
  useDeleteProcessChainMutation,
  useUpdateProcessChainActionMutation,
  useRunProcessChainMutation,
} from "../process";
import { useState } from "react";
import Router from "next/router";
import { AiOutlineSchedule } from "react-icons/ai";
import { usePermission } from "@/common/hooks/use-permission";

interface ProcessCardProps {
  process: any;
  onLoad: (process: any) => void;
}

const LoadButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      className="dag-btn border-gray-500 text-gray-500 rounded-md hover:bg-gray-500 hover:text-white focus:outline-none focus:bg-gray-500 focus:text-white"
    >
      Load Data
    </Button>
  );
};

const ViewButton = ({ id }: { id: string }) => {
  const [editAccess] = useUpdateProcessChainActionMutation();

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

const DeleteButton = ({ id }: { id: string }) => {
  const [deleteProcessChain] = useDeleteProcessChainMutation();

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(false);

  const remove = () => {
    setLoading(true);
    deleteProcessChain(id).then((res: any) => {
      if (res.error) {
        ShowMessage("error", res.error.message);
        return;
      }

      close();
    });
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
            <Button loading={loading} onClick={remove} type="text">
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
      <Button loading={loading} className="dag-btn border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white focus:outline-none focus:bg-red-500 focus:text-white">
        Disable
      </Button>
    </Popover>
  );
};

const RunButton = ({ id }: { id: string }) => {
  const [runPipeline] = useRunProcessChainMutation();
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

export const ProcessCard = ({ process, onLoad }: ProcessCardProps) => {
  const { hasPermission } = usePermission();
  const steps = [
    {
      title: "Data Source Selection",
      icon: <BiGitMerge />,
    },
    {
      title: "Orchestration",
      icon: <AiOutlineSchedule />,
    },
    {
      title: "Analytics Data Model",
      icon: <BiTable />,
    },
    {
      title: "Charts",
      icon: <BiChart />,
    },
  ];

  const items = steps.map((item: any) => ({ ...item, key: item.title }));

  const [state, setState] = useState(false);

  const [current, setCurrent] = useState(0);

  return (
    <div className="bg-white mb-5 shadow border rounded-3xl p-5 px-8">
      <div className="flex justify-between items-center">
        <div className="flex justify-between flex-1 items-center">
          <div className="flex justify-between space-x-10">
            <div className="text-sm flex flex-col items-center">
              <p className="mb-2 text-xs font-bold">Process Name</p>
              <p className="bg-gray-100 text-prim rounded-full p-1 px-3">
                {process.name}
              </p>
            </div>
            <div className="text-sm flex flex-col items-center">
              <p className="mb-2 text-xs font-bold">Schedule</p>
              <p className="bg-gray-100 text-prim rounded-full p-1 px-3">
                {process.schedule_interval}
              </p>
            </div>
            <div className="text-sm flex flex-col items-center">
              <p className="mb-2 text-xs font-bold">State</p>
              {process.state === "active" ? (
                <p className="bg-gray-100 text-prim rounded-full p-1 px-3">
                  Active
                </p>
              ) : (
                <p className="bg-red-100 text-red-500 rounded-full p-1 px-3">
                  Inactive
                </p>
              )}
            </div>
          </div>
          {process.state === "active" && <div className="flex space-x-2 justify-end">
            {hasPermission('process:update') && (
              <LoadButton onClick={() => onLoad(process)} />
            )}
            {hasPermission('process:run') && process.airflow && (
              <RunButton id={process.dag_id} />
            )}
            {hasPermission('process:read') && process.airflow && (
              <ViewButton id={process.dag_id} />
            )}
            {hasPermission('process:delete') &&  (
              <DeleteButton id={process.dag_id} />
            )}
          </div>}
        </div>
        <div className="w-1/3 flex justify-end">
          {state ? (
            <button onClick={() => setState(false)}>
              <BiChevronUp className="text-4xl text-prim" />
            </button>
          ) : (
            <button onClick={() => setState(true)}>
              <BiChevronDown className="text-4xl text-prim" />
            </button>
          )}
        </div>
      </div>
      {state ? (
        <div className="pt-14 pb-5 flex justify-center">
          <div className="w-2/3">
            <Steps current={current} items={items} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
