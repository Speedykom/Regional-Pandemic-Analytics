import { Modal } from "antd";
import { useGetAirflowChainMutation } from "../process";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { Loader } from "@/common/components/Loader";

interface Props {
  state: boolean;
  onClose: () => void;
  process: any;
}

export const AirflowModal = ({ state, onClose, process }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [getRuns] = useGetAirflowChainMutation();
  const [runs, setRuns] = useState<any[]>([]);

  useEffect(() => {
    if (state) {
      getRuns(process.airflow.dag_id).then(({ data }: any) => {
        if (data) {
          const { runs } = data;
          setRuns(runs);
        }

        setIsLoading(false);
      });
    }
  }, [getRuns, process.airflow.dag_id, state]);

  return (
    <Modal
      open={state}
      title="Data Source Selection"
      width={800}
      onCancel={onClose}
      maskClosable={false}
      footer
    >
        {isLoading ? (
          <div className="h-52 flex items-center justify-center border-t">
            <div className="h-16 w-16">
              <Loader />
            </div>
          </div>
        ) : (
          <div className="border-t mt-1 pt-5">
            <div className="flex justify-between mb-5">
              <div className="flex space-x-2">
                <p>Dag Id</p>:{" "}
                <p className="font-bold">{process.airflow.dag_id}</p>
              </div>
              <div className="flex space-x-2">
                <p>Owners</p>:{" "}
                <p className="font-bold">{process.airflow.owners.toString()}</p>
              </div>
              <div className="flex space-x-2">
                <p>Schedule</p>:{" "}
                <p className="font-bold">
                  {process.airflow.schedule_interval.value}
                </p>
              </div>
            </div>
            <div className="flex justify-between mb-5">
              <div className="flex space-x-2">
                <p>Last Dag Run</p>:{" "}
                <p className="font-bold">
                  {new Date(process.airflow.last_parsed_time).toUTCString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <p>Next Dag Run</p>:{" "}
                <p className="font-bold">
                  {process.airflow.next_dagrun
                    ? new Date(process.airflow.next_dagrun).toUTCString()
                    : "Only run once"}
                </p>
              </div>
              <div className="flex space-x-2">
                <p>Total Runs</p>: <p className="font-bold">{runs.length}</p>
              </div>
            </div>
            <div className="rounded-md border pt-3 mb-2">
              <h2 className="px-4 font-bold border-b pb-2">Dag Runs</h2>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Run type</TableHeaderCell>
                    <TableHeaderCell>DataSource</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {runs.map((task: any) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.run_type}</TableCell>
                      <TableCell>
                        {new Date(task.execution_date).toLocaleString()}
                      </TableCell>
                      <TableCell>{task.state}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
    </Modal>
  );
};
