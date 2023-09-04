import React, { useState } from 'react';
import { Button } from '@tremor/react';
import { Loader } from '@/common/components/Loader';
import { usePermission } from '@/common/hooks/use-permission';
import { useGetProcessQuery } from '../process';
import { DagDetails } from '../interface';
import ProcessCard from '../components/ProcessCard';
import { AddProcess } from './add';
import { useGetAllPipelinesQuery } from '@/modules/pipeline/pipeline';

export default function ProcessChainList() {
  const { hasPermission } = usePermission();
  const [addComponent, setAddComponent] = useState(false);

  const closePanel = () => {
    setAddComponent(false);
  };

  const { data, isLoading, isSuccess, refetch } = useGetProcessQuery();

  const { data: pipelineList, isSuccess: isSuccessPipeline } =
    useGetAllPipelinesQuery();

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl">Process Chain</h2>
          <p className="my-2 text-gray-600">
            View and manage all process chains
          </p>
        </div>
        <div>
          {hasPermission('process:add') && (
            <Button
              className="bg-prim hover:bg-prim-hover border-0"
              onClick={(event) => {
                event.preventDefault();
                setAddComponent(true);
              }}
            >
              Add Process Chain
            </Button>
          )}
        </div>
      </div>
      <div className="mt-5">
        {isLoading && (
          <div className="flex h-96 bg-white shadow-md border rounded-md items-center justify-center">
            <div className="w-16 h-16">
              <Loader />
            </div>
          </div>
        )}
        {isSuccess && (
          <div>
            {data.dags.map((process: DagDetails) => {
              return <ProcessCard key={process.dag_id} process={process} />;
            })}
          </div>
        )}
      </div>
      {addComponent && isSuccessPipeline && (
        <AddProcess
          pipelineList={pipelineList}
          refetch={refetch}
          panelState={addComponent}
          closePanel={closePanel}
        />
      )}
    </div>
  );
}
