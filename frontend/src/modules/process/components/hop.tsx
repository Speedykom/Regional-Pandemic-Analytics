import { Modal } from "antd";
import { useGetHopChainMutation, useUpdateHopChainMutation } from "../process";
import { useEffect, useState } from "react";
import { Button, Select, SelectItem } from "@tremor/react";
import { useFindAllQuery } from "@/modules/pipeline/pipeline";
import { toast } from "react-toastify";
import { Loader } from "@/common/components/Loader";

interface Props {
  state: boolean;
  onClose: () => void;
  process: any;
}

export const HopModal = ({ state, onClose, process }: Props) => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [getData] = useGetHopChainMutation();
  const [updateHop] = useUpdateHopChainMutation();
  const { data: pipeline } = useFindAllQuery();
  const [data, setData] = useState<any>();
  const [pipelineId, setPipeline] = useState<any>();

  useEffect(() => {
    if (state && process) {
      getData(process.pipeline).then(({ data }: any) => {
        setData(data.data);
        setPipeline(process.pipeline);
        setIsLoading(false);
      });
    }
  }, [getData, process, state]);

  const submit = () => {
    const body: any = { id: process.id, pipeline: pipelineId };
    setLoading(true);
    updateHop(body).then((res) => {
      toast.success("Pipeline chain successfully on process chain", {
        delay: 200,
        position: "top-right",
      });
      onClose();
      setLoading(false);
    });
  };

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
        <>
          <div className="border-t border-b mt-1 py-3">
            <div className="flex justify-between mb-5">
              <div className="flex space-x-2">
                <p>Name</p>: <p className="font-bold">{data.name}</p>
              </div>
              <div className="flex space-x-2">
                <p>Pipeline File</p>: <p className="font-bold">{data.path}</p>
              </div>
              <div className="flex space-x-2">
                <p>parquet_path</p>:{" "}
                <p className="font-bold">{data.parquet_path}</p>
              </div>
            </div>
            <div>
              <p className="border-b mb-1 pb-1">Descriprion:</p>
              <p>{data.description}</p>
            </div>
          </div>
          <div className="border-b mt-3 pb-3 flex space-x-3">
            <Select
              value={pipelineId}
              onChange={(v) => setPipeline(v)}
              placeholder="Select Pipeline"
            >
              {pipeline.data.map((e: any) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </Select>
            <Button
              onClick={submit}
              loading={loading}
              className="bg-prim text-white rounded-md border-0 hover:bg-green-700"
              size="lg"
            >
              Update Chain
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
