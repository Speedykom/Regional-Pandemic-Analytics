import React, { useState } from 'react';
import { Button } from '@tremor/react';
import { Loader } from '@/common/components/Loader';
import { usePermission } from '@/common/hooks/use-permission';
import { useGetProcessQuery } from '../process';
import { DagDetails } from '../interface';
import ProcessCard from '../components/ProcessCard';
import { AddProcess } from './add';
import { useGetAllPipelinesQuery } from '@/modules/pipeline/pipeline';
import { useTranslation } from 'react-i18next';
export default function ProcessChainList() {
  const { hasPermission } = usePermission();
  const [addComponent, setAddComponent] = useState(false);
  const { t } = useTranslation();
  const closePanel = () => {
    setAddComponent(false);
  };

  const { data, isLoading, isSuccess, refetch } = useGetProcessQuery();

  const { data: pipelineList, isSuccess: isSuccessPipeline } =
    useGetAllPipelinesQuery('');

  const [searchInput, setSearchInput] = useState<string>('');

  const filteredPipelines = data?.dags.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl">{t('processChain')}</h2>
          <p className="my-2 text-gray-600">
            {t('viewAndManageProcessChains')}{' '}
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
              {t('addProcessChain')}
            </Button>
          )}
        </div>
      </div>
      <input
        type="text"
        placeholder="Search for process chains..."
        className="w-full border border-gray-300 rounded-md p-2 mt-3"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="mt-5">
        {isLoading && (
          <div className="flex h-96 bg-white shadow-md border rounded-md items-center justify-center">
            <div className="w-16 h-16">
              <Loader />
            </div>
          </div>
        )}
        {isSuccess && pipelineList && (
          <div>
            {filteredPipelines?.map((process: DagDetails) => {
              return (
                <ProcessCard
                  key={process.dag_id}
                  process={process}
                  pipelineList={pipelineList}
                />
              );
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
