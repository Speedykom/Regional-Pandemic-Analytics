import React, { useState } from 'react';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
} from '@tremor/react';
import { Loader } from '@/common/components/Loader';
import { usePermission } from '@/common/hooks/use-permission';
import {
  useGetProcessQuery,
  useRunProcessByIdMutation,
  useToggleProcessStatusMutation,
} from '../process';
import { DagDetails, DagDetailsResponse } from '../interface';
import { AddProcess } from './add';
import { useGetAllPipelinesQuery } from '@/modules/pipeline/pipeline';
import { useTranslation } from 'react-i18next';
import { Switch } from '@tremor/react';
import ProcessCard from '../components/ProcessCard';
import ProcessChainDialog from './dialog';

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

  const [currentPageEnabled, setCurrentPageEnabled] = useState(1);
  const [currentPageDisabled, setCurrentPageDisabled] = useState(1);
  const defaultPageSize = 5;
  const [showDisabled, setShowDisabled] = useState(false);
  const toggleShowDisabled = () => {
    setShowDisabled(!showDisabled);
    setCurrentPageEnabled(1);
    setCurrentPageDisabled(1);
  };
  const enabledProcesses = data?.dags?.filter((dag) => dag.status === true);
  const disabledProcesses = data?.dags?.filter((dag) => dag.status === false);
  const processChainToShow = showDisabled
    ? disabledProcesses
    : enabledProcesses;
  const processChainToShowLength = processChainToShow?.length || 0;
  const totalPages = Math.ceil(processChainToShowLength / defaultPageSize);
  const currentPage = showDisabled ? currentPageDisabled : currentPageEnabled;
  const startIndex =
    ((showDisabled ? currentPageDisabled : currentPageEnabled) - 1) *
    defaultPageSize;
  const endIndex =
    (showDisabled ? currentPageDisabled : currentPageEnabled) * defaultPageSize;
  const paginatedProcesses = processChainToShow?.slice(startIndex, endIndex);

  const renderPagination = (processChainList: DagDetailsResponse) => {
    if (
      !defaultPageSize ||
      !processChainList ||
      processChainList?.dags?.length == 0
    )
      return null;

    const startItem = Math.min(startIndex + 1, processChainToShowLength);
    const endItem = Math.min(endIndex, processChainToShowLength);

    return (
      <>
        <div className="flex justify-end items-center mt-4">
          <div className="mr-4">
            {t('showing')} {startItem} – {endItem} {t('of')}{' '}
            {processChainToShowLength}
          </div>
          <div className="flex">
            <Button
              className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer mr-2"
              size="xs"
              disabled={processChainToShowLength === 0 || currentPage === 1}
              onClick={() => {
                if (showDisabled) {
                  setCurrentPageDisabled(currentPageDisabled - 1);
                } else {
                  setCurrentPageEnabled(currentPageEnabled - 1);
                }
              }}
            >
              &larr; {t('prev')}
            </Button>
            <Button
              className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer"
              size="xs"
              disabled={
                processChainToShowLength === 0 || currentPage === totalPages
              }
              onClick={() => {
                if (showDisabled) {
                  setCurrentPageDisabled(currentPageDisabled + 1);
                } else {
                  setCurrentPageEnabled(currentPageEnabled + 1);
                }
              }}
            >
              {t('next')} &rarr;
            </Button>
          </div>
        </div>
      </>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderProcessChainData = () => {
    return (
      <ProcessCard
        paginatedProcesses={paginatedProcesses || []}
        showDisabled={showDisabled}
        t={t}
        handleRunProcess={handleRunProcess}
        handleToggleProcessStatus={handleToggleProcessStatus}
        setIsOpen={setIsOpen}
        setTab={setTab}
        setProcessData={setProcessData}
      />
    );
  };

  const [tab, setTab] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [processData, setProcessData] = useState<DagDetails | null>(null);
  const [runProcessById] = useRunProcessByIdMutation();
  const [toggleProcessStatus] = useToggleProcessStatusMutation();

  const handleRunProcess = (dagId: string) => {
    runProcessById(dagId);
  };

  function handleToggleProcessStatus(dagId: string) {
    toggleProcessStatus(dagId);
  }
  return (
    <div>
      {processData && (
        <ProcessChainDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          tab={tab}
          setTab={setTab}
          processData={processData}
        />
      )}
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
        placeholder={t('searchForProcesscChains')}
        className="w-full border border-gray-300 rounded-md p-2 mt-3"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="mt-3 flex justify-end items-center">
        <label htmlFor="switch" className="mr-2 text-gray-600">
          {t('ShowDisabledProcessChain')}
        </label>
        <Switch
          id="switch"
          name="switch"
          checked={showDisabled}
          onChange={toggleShowDisabled}
        />
      </div>
      <div className="mt-5">
        {isLoading ? (
          <div className="flex h-96 bg-white shadow-md border rounded-md items-center justify-center">
            <div className="w-16 h-16">
              <Loader />
            </div>
          </div>
        ) : (
          isSuccess &&
          pipelineList && (
            <>
              <Card className="p-0 rounded-md">
                <Table className="rounded-md">
                  <TableHead className="bg-[#F9FAFB] border-[1px] border-[#E4E7EC]">
                    <TableHeaderCell className="text-[#475467]">
                      {t('processChainDialog.ProcessChainName')}
                    </TableHeaderCell>
                    <TableHeaderCell className="text-[#475467]">
                      {t('processChainDialog.dataPip')}
                    </TableHeaderCell>
                    <TableHeaderCell className="text-[#475467]">
                      {t('processChainDialog.period')}
                    </TableHeaderCell>
                    <TableHeaderCell className="text-[#475467]">
                      {t('processChainDialog.processStatus')}
                    </TableHeaderCell>
                    <TableHeaderCell className="text-[#475467]">
                      {t('processChainDialog.execState')}
                    </TableHeaderCell>
                    <TableHeaderCell className="w-1/4 border-[#E4E7EC] border-l-[1px] text-[#475467]">
                      {t('processChainDialog.actions')}
                    </TableHeaderCell>
                  </TableHead>
                  <TableBody>{renderProcessChainData()}</TableBody>
                </Table>
                <div className="py-1">{renderPagination(data)}</div>
              </Card>
            </>
          )
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
