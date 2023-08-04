import { Modal, Table } from "antd";
import { useGetHopChainMutation } from "../process";
import { useEffect, useState } from "react";

interface Props {
  state: boolean;
  onClose: () => void;
  process: any;
}

export const HopModal = ({ state, onClose, process }: Props) => {
  const [getData] = useGetHopChainMutation();
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (state) {
      getData(process?.pipeline).then(({ data }: any) => {
        setData(data.data);
      });
    }
  }, [state]);

  return (
    <Modal
      open={state}
      title="Data Source Selection"
      width={800}
      onCancel={onClose}
      footer
    >
      <div className="border-t mt-1 pt-3">
        <div className="flex justify-between mb-5">
          <div className="flex space-x-2">
            <p>Name</p>:{" "}
            <p className="font-bold">{data?.name}</p>
          </div>
          <div className="flex space-x-2">
            <p>Pipeline File</p>:{" "}
            <p className="font-bold">{data?.path}</p>
          </div>
          <div className="flex space-x-2">
            <p>parquet_path</p>:{" "}
            <p className="font-bold">
              {data?.parquet_path}
            </p>
          </div>
        </div>
        <div>
          <p className="border-b mb-1 pb-1">Descriprion:</p>
          <p>{data?.description}</p>
        </div>
      </div>
    </Modal>
  );
};

// name(pin):"covid"
// path(pin):"covid.hpl"
// user_id(pin):"5d064301-d601-4914-a1fa-0734a96f266a"
// parquet_path(pin):"/opt/shared/covid.parquet"
// description(pin):"covid"