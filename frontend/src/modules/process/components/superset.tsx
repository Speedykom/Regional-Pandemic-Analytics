import { Modal, Table } from "antd";
import { useGetHopChainMutation } from "../process";
import { useEffect, useState } from "react";

interface Props {
  state: boolean;
  onClose: () => void;
  process: any;
}

export const SupersetModal = ({ state, onClose, process }: Props) => {
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
      title="Chart(s)"
      width={800}
      onCancel={onClose}
      footer
    >
      <p>Superset is in progress</p>
    </Modal>
  );
};