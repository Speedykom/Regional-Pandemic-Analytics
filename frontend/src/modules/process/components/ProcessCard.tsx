import { ShowMessage } from "@/common/components/ShowMessage";
import { Button, List, ListItem, Title } from "@tremor/react";
import { DagDetails } from "../interface";
import {
  BiChart,
  BiGitMerge,
  BiTable,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";
import { AiOutlineSchedule } from "react-icons/ai";
import { usePermission } from "@/common/hooks/use-permission";
import { useGetProcessHistoryByIdQuery } from "../process";
import { useState } from "react";

interface IProcessCard {
  process: DagDetails;
}

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

export default function ProcessCard({ process }: IProcessCard) {
  const { data, error, isLoading, isFetching, isSuccess } =
    useGetProcessHistoryByIdQuery(process.dag_id);
  const { hasPermission } = usePermission();
  const [state, setState] = useState(false);
  return (
    <div className="bg-white mb-3 shadow border rounded-3xl p-5">
      <div className="flex flex-col ">
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
              {process.status ? (
                <span className="bg-gray-100 text-prim rounded-full p-1 px-3">
                  {" "}
                  Active{" "}
                </span>
              ) : (
                <span className="bg-red-100 text-red-500 rounded-full p-1 px-3">
                  {" "}
                  Inactive{" "}
                </span>
              )}
            </div>
            <div className="flex space-x-2 justify-end">
              {hasPermission("process:update") && (
                <Button variant="secondary" color="gray">
                  Load Data
                </Button>
              )}
              {hasPermission("process:run") && process.dag_id && (
                <Button variant="secondary" color="green">
                  Run
                </Button>
              )}
              {hasPermission("process:read") && process.dag_id && (
                <Button variant="secondary">View</Button>
              )}
              {hasPermission("process:delete") && (
                <Button variant="secondary" color="red">
                  Disable
                </Button>
              )}
            </div>
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
          <div className="pt-14 pb-5 flex flex-col justify-center">
            <div className="flex justify-center space-x-10">
              <div className="flex">
                {steps.map((step) => {
                  return (
                    <div key={step.title} className="p-2 flex space-x-2">
                      <span>{step.icon}</span>
                      <span>{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {isSuccess && (
              <div>
                <Title>Last Execution</Title>
                <List>
                  {data.dag_runs.map((dagRun) => {
                    return (
                      <ListItem key={dagRun.dag_run_id}>
                        <span>{dagRun.dag_run_id}</span>
                        <span>{dagRun.status}</span>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
