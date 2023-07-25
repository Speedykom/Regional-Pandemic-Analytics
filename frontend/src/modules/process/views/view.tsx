import { Collapse } from "antd";
import { AppDrawer } from "../../../common/components/AppDrawer";
import { Loader } from "../../../common/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";

interface prop {
  onClose: () => void;
  state: boolean;
  id: string;
}

export const ViewDag = ({ onClose, state, id }: prop) => {
  const [loading, setLoading] = useState(false);
  const [dag, setRow] = useState<any>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = () => {
    setLoading(true);
    axios
      .post(`/api/process/${id}`)
      .then((res: any) => {
        const row = res.data.dag;
        setRow(row);
      })
      .catch((res: any) => {
        onClose();
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [fetchData, id, state]);

  const { Panel } = Collapse;

  return (
    <AppDrawer title="View Process" onClose={onClose} state={state}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="w-10 h-10">
            <Loader />
          </div>
        </div>
      ) : (
        <div className="text-sm">
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Dag:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.dag_id}
            </p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Schedule Interval:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.schedule_interval.value}
            </p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Timetable:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.timetable_description}
            </p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Description:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.description || "None"}
            </p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Last parsed time:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {new Date(dag?.dag?.last_parsed_time).toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Next dag run:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {new Date(dag?.dag?.next_dagrun).toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Owners:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.owners}
            </p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Active:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.is_active ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Paused:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.is_paused ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Druid Schema:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.data_source_name}
            </p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="w-1/3">Total Runs:</p>
            <p className="font-semibold w-2/3 flex justify-end">
              {dag?.dag?.runs.length}
            </p>
          </div>
          <div className="mt-5">
            <Collapse defaultActiveKey={["1"]}>
              {dag?.dag?.runs.map((run: any) => (
                <Panel
                  header={`${new Date(run.execution_date).toLocaleString()} - ${
                    run.state
                  }`}
                  key={run.dag_run_id}
                >
                  <div className="flex justify-between items-center mb-5">
                    <p>Run:</p>
                    <p className="font-semibold">{run.dag_run_id}</p>
                  </div>
                  <div className="flex justify-between items-center mb-5">
                    <p>Run Type:</p>
                    <p className="font-semibold">{run.run_type}</p>
                  </div>
                  <div className="flex justify-between items-center mb-5">
                    <p>External trigger:</p>
                    <p className="font-semibold">
                      {run.external_trigger ? "Yes" : "No"}
                    </p>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      )}
    </AppDrawer>
  );
};
