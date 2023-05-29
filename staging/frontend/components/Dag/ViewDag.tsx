import { Button, Collapse, Form, Input } from "antd";
import { useState } from "react";
import { AppDrawer } from "../AppDrawer";
import { useFindOneQuery } from "@/redux/services/process";
import { Loader } from "../Loader";

interface prop {
  onClose: () => void;
  state: boolean;
  id: string;
}

export const ViewDag = ({ onClose, state, id }: prop) => {
  const { data: dag, isLoading: loading } = useFindOneQuery(id);

  const { Panel } = Collapse;

  return (
    <AppDrawer title="View Process" onClose={onClose} state={state}>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div className="text-sm">
          <div className="flex justify-between items-center mb-3">
            <p className="w-1/3">Dag:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.dag_id}
            </p>
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="w-1/3">Schedule Interval:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.schedule_interval.value}
            </p>
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="w-1/3">Timetable:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.timetable_description}
            </p>
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="w-1/3">Description:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.description || "None"}
            </p>
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="w-1/3">Last parsed time:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {new Date(dag?.dag?.last_parsed_time).toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="w-1/3">Next dag run:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {new Date(dag?.dag?.next_dagrun).toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="w-1/3">Owners:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.owners}
            </p>
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="w-1/3">Active:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.is_active ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="w-1/3">Paused:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.is_paused ? "Yes" : "No"}
            </p>
          </div>
          <div className="mt-5">
            <Collapse defaultActiveKey={["1"]}>
              {dag?.dag?.runs.map((run: any) => (
                <Panel header={`${new Date(run.execution_date).toLocaleString()} - ${run.state}`} key={run.dag_run_id}>
                  <p>{run.dag_run_id}</p>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      )}
    </AppDrawer>
  );
};
