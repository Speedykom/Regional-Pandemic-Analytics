import { Modal } from "antd";
import { useGetAirflowChainMutation } from "../process";
import { useEffect, useState } from "react";

interface Props {
  state: boolean;
  onClose: () => void;
  process: any;
}

export const AirflowModal = ({ state, onClose, process }: Props) => {
  const [getRuns] = useGetAirflowChainMutation();
  const [runs, setRuns] = useState<any[]>([]);

  useEffect(() => {
    if (state) {
      getRuns(process?.airflow.dag_id).then(({ data }: any) => {
        if (data) {
          const { runs } = data;
          setRuns(runs);
        }
      });
    }
  }, [state]);

  return (
    <Modal
      open={state}
      title="Orchestration"
      width={800}
      onCancel={onClose}
      footer
    >
      <div className="border-t mt-1 pt-3">
        <div className="flex justify-between mb-5">
          <div className="flex space-x-2">
            <p>Dag Id</p>:{" "}
            <p className="font-bold">{process?.airflow.dag_id}</p>
          </div>
          <div className="flex space-x-2">
            <p>Owners</p>:{" "}
            <p className="font-bold">{process?.airflow.owners.toString()}</p>
          </div>
          <div className="flex space-x-2">
            <p>Schedule</p>:{" "}
            <p className="font-bold">
              {process?.airflow.schedule_interval.value}
            </p>
          </div>
        </div>
        <div className="flex justify-between mb-5">
          <div className="flex space-x-2">
            <p>Last Dag Run</p>:{" "}
            <p className="font-bold">
              {new Date(process?.airflow.last_parsed_time).toUTCString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <p>Next Dag Run</p>:{" "}
            <p className="font-bold">
              {process?.airflow.next_dagrun
                ? new Date(process?.airflow.next_dagrun).toUTCString()
                : "Only run once"}
            </p>
          </div>
          <div className="flex space-x-2">
            <p>Total Runs</p>: <p className="font-bold">{runs.length}</p>
          </div>
        </div>
        <div>
          <p className="border-b">Dag Runs</p>
          {runs.map((run, index) => (
            <div className="border-b py-2" key={index}>
              <div className="mb-1 flex space-x-3">
                <p>Execution date:</p>
                <p className="font-semibold">
                  {new Date(run.execution_date).toUTCString()}
                </p>
              </div>
              <div className="mb-1 flex space-x-3">
                <p>Type:</p>
                <p className="font-semibold">{run.run_type}</p>
              </div>
              <div className="mb-1 flex space-x-3">
                <p>State:</p>
                <p className="font-semibold">{run.state}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

// dag_id(pin):"covid-19-process"
// dag_run_id(pin):"manual__2023-08-04T01:11:20.743528+00:00"
// data_interval_end(pin):"2023-08-04T01:11:20.743528+00:00"
// data_interval_start(pin):"2023-08-04T01:11:20.743528+00:00"
// end_date(pin):"2023-08-04T01:16:34.796718+00:00"
// execution_date(pin):"2023-08-04T01:11:20.743528+00:00"
// external_trigger(pin):true
// last_scheduling_decision(pin):"2023-08-04T01:16:34.794102+00:00"
// logical_date(pin):"2023-08-04T01:11:20.743528+00:00"
// note(pin):null
// run_type(pin):"manual"
// start_date(pin):"2023-08-04T01:11:21.096384+00:00"
// state(pin):"failed"
