import React, { useState } from 'react';
import { Button } from '@tremor/react';
import { Loader } from '@/common/components/Loader';
import { usePermission } from '@/common/hooks/use-permission';
import { useGetProcessQuery } from '../process';
import { DagDetails, DagDetailsResponse } from '../interface';
import ProcessCard from '../components/ProcessCard';
import { AddProcess } from './add';
import { useGetAllPipelinesQuery } from '@/modules/pipeline/pipeline';
import { useTranslation } from 'react-i18next';
import { Switch } from '@tremor/react';

export default function ProcessChainList() {
  const { hasPermission } = usePermission();
  const [addComponent, setAddComponent] = useState(false);
  const { t } = useTranslation();
  const closePanel = () => {
    setAddComponent(false);
  };

  const { data: pipelineList, isSuccess: isSuccessPipeline } =
    useGetAllPipelinesQuery('');

  const [searchInput, setSearchInput] = useState<string>('');
  const { data, isLoading, isSuccess, refetch } =
    useGetProcessQuery(searchInput);

  const [currentPage, setCurrentPage] = useState(1);
  const defaultPageSize = 5;

  const [showDisabled, setShowDisabled] = useState(false);
  const toggleShowDisabled = () => {
    setShowDisabled(!showDisabled);
  };

  const renderPagination = (processChainList: DagDetailsResponse) => {
    if (
      !defaultPageSize ||
      !processChainList ||
      processChainList?.dags?.length == 0
    )
      return null;

    const totalPages = Math.ceil(
      processChainList?.dags?.length / defaultPageSize
    );
    const startItem = (currentPage - 1) * defaultPageSize + 1;
    const endItem = Math.min(
      currentPage * defaultPageSize,
      processChainList?.dags?.length
    );

    return (
      <div className="flex justify-end items-center mt-4">
        <div className="mr-4">
          Showing {startItem} – {endItem} of {processChainList.dags?.length}
        </div>
        <div className="flex">
          <Button
            className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer mr-2"
            size="xs"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &larr; Prev
          </Button>
          <Button
            className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer"
            size="xs"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next &rarr;
          </Button>
        </div>
      </div>
    );
  };

  const renderProcessChainData = (processChainList: DagDetails[]) => {
    if (!defaultPageSize && !!pipelineList) {
      return processChainList.map((process) => {
        return (
          <ProcessCard
            key={process.dag_id}
            process={process}
            pipelineList={pipelineList}
            showDisabled={showDisabled}
          />
        );
      });
    }

    const startIndex = (currentPage - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    if (!!pipelineList) {
      return processChainList?.slice(startIndex, endIndex).map((process) => {
        return (
          <ProcessCard
            key={process.dag_id}
            process={process}
            pipelineList={pipelineList}
            showDisabled={showDisabled}
          />
        );
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl">{t('processChain')}</h2>
          <p className="my-2 text-gray-600">
            {t('viewAndManageProcessChains')}
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
      <div className="mt-3 flex justify-end items-center">
        <label htmlFor="switch" className="mr-2 text-gray-600">
          Show disabled Process Chains
        </label>
        <Switch
          id="switch"
          name="switch"
          checked={showDisabled}
          onChange={toggleShowDisabled}
        />
      </div>
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
            {renderProcessChainData(data?.dags)}
            {renderPagination(data)}
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
