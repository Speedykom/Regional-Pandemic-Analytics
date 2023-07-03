import { ShowMessage } from "@/common/components/ShowMessage";
import { Button, Popover } from "antd";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import {
  useDelProcessMutation,
  useEditAccessMutation,
  useRunProcessMutation,
} from "../process";
import { useState } from "react";
import Router from "next/router";

interface props {
  process: any;
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
      <Button className="dag-btn border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white focus:outline-none focus:bg-red-500 focus:text-white">
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

export const ProcessCard = ({ process }: props) => {
  const [state, setState] = useState(false);

  return (
    <div className="bg-white mb-5 shadow border rounded-3xl p-5 px-8">
      <div className="flex justify-between items-center">
        <div className="flex justify-between flex-1 items-center">
          <div className="flex justify-between space-x-10">
            <div className="text-sm flex flex-col items-center">
              <p className="mb-2">Process Name</p>
              <p className="bg-gray-100 text-prim rounded-full p-1 px-3">
                {process.name}
              </p>
            </div>
            <div className="text-sm flex flex-col items-center">
              <p className="mb-2">Schedule</p>
              <p className="bg-gray-100 text-prim rounded-full p-1 px-3">
                {process.schedule_interval}
              </p>
            </div>
            <div className="text-sm flex flex-col items-center">
              <p className="mb-2">State</p>
              <p className="bg-gray-100 text-prim rounded-full p-1 px-3">
                {process.airflow
                  ? process.airflow.is_active
                    ? "Active"
                    : "Inactive"
                  : "Orchestration in progress"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 justify-end">
            {process.airflow ? <RunButton id={process.dag_id} /> : null}
            {process.airflow ? <ViewButton id={process.dag_id} /> : null}
            <DelButton id={process.dag_id} />
          </div>
        </div>
        <div className="w-1/3 flex justify-end">
          {state ? (
            <button onClick={() => setState(false)}>
              <BiChevronUp className="text-3xl text-prim" />
            </button>
          ) : (
            <button onClick={() => setState(true)}>
              <BiChevronDown className="text-3xl" />
            </button>
          )}
        </div>
      </div>
      {state ? (
        <div className="py-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, mollitia
          accusamus rem sequi exercitationem dolorem cupiditate, magnam odit
          consectetur necessitatibus voluptates perferendis reprehenderit
          consequatur quisquam rerum commodi sit nemo tenetur?
        </div>
      ) : null}
    </div>
  );
};
