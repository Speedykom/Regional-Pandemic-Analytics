import React, { useState } from 'react';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
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
import { FaPlay } from 'react-icons/fa';
import { AiOutlinePieChart, AiOutlineStop } from 'react-icons/ai';
import { TbReportSearch } from 'react-icons/tb';
import ProcessChainDialog from './dialog';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';

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

  const filteredProcesses = showDisabled
    ? data?.dags?.filter((dag) => dag.status === false)
    : data?.dags?.filter((dag) => dag.status === true);

  const processChainToShowLength = filteredProcesses?.length || 0;

  const totalPages = Math.ceil(processChainToShowLength / defaultPageSize);
  const startIndex = (currentPage - 1) * defaultPageSize;
  const endIndex = currentPage * defaultPageSize;

  const paginatedProcesses = filteredProcesses?.slice(startIndex, endIndex);

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
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &larr; {t('prev')}
            </Button>
            <Button
              className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer"
              size="xs"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
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
    if (!paginatedProcesses) return null;

    return paginatedProcesses
      .filter((e) => (showDisabled ? !e.status : e.status)) // Filter based on status
      .map((e, k) => (
        <TableRow key={k} className="border-[1px] border-[#E4E7EC]">
          <TableCell className="text-black">{e?.name}</TableCell>
          <TableCell className="text-blue-700 underline font-normal">
            {e?.data_source_name}
          </TableCell>
          <TableCell>{e?.schedule_interval}</TableCell>
          <TableCell className="my-auto">
            {e?.status ? (
              <>
                <span className="text-2xl text-green-700 relative top-[3.5px]">
                  •
                </span>{' '}
                <span className="!font-medium">
                  {t('processChainDialog.activeStatus')}
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl text-red-700 relative top-[3.5px]">
                  •
                </span>{' '}
                <span className="!font-medium">
                  {t('processChainDialog.inactiveStatus')}
                </span>
              </>
            )}
          </TableCell>
          <TableCell>
            {e.latest_dag_run_status === 'success' ? (
              <span className="bg-transparent py-3 text-green-700 border-green-700 w-32">
                {t('processChainDialog.success')}
              </span>
            ) : e.latest_dag_run_status === 'failed' ? (
              <span className="bg-transparent py-3 text-red-700 border-red-700 w-32">
                {t('processChainDialog.failed')}
              </span>
            ) : (
              <span className="bg-transparent py-3 text-yellow-700 border-yellow-700 w-32">
                {t('processChainDialog.running')}
              </span>
            )}
          </TableCell>
          <TableCell className="border-[#E4E7EC] border-l-[1px]">
            <div
              className={`flex flex-row gap-x-2 ${
                e?.latest_dag_run_status !== 'success' &&
                e?.latest_dag_run_status !== 'failed'
                  ? 'pointer-events-none opacity-50'
                  : ''
              }`}
            >
              {e?.status === true ? (
                <>
                  <>
                    <FaPlay
                      size="40"
                      color="#15803d"
                      className="p-2 rounded-md border-[1.8px] border-green-700 cursor-pointer play"
                      onClick={(
                        event: React.MouseEvent<SVGElement, MouseEvent>
                      ) => handleRunProcess(event, e?.dag_id)}
                    />
                    <Tooltip anchorSelect=".play" place="top">
                      {t('processChainDialog.startProcess')}
                    </Tooltip>
                  </>
                  <>
                    <AiOutlineStop
                      size="40"
                      color="#b91c1c"
                      className={
                        'p-2 rounded-md border-[1.8px] border-red-700 cursor-pointer stop'
                      }
                      onClick={() => handleToggleProcessStatus(e?.dag_id)}
                    />
                    <Tooltip anchorSelect=".stop" place="top">
                      {t('processChainDialog.disableProcess')}
                    </Tooltip>
                  </>
                  <>
                    <AiOutlinePieChart
                      size="40"
                      color="black"
                      className="p-2 rounded-md border-[1.8px] border-black cursor-pointer chart"
                      onClick={() => {
                        setIsOpen(true);
                        setTab(2);
                      }}
                    />
                    <Tooltip anchorSelect=".chart" place="top">
                      {t('processChainDialog.viewChart')}
                    </Tooltip>
                  </>
                  <>
                    <TbReportSearch
                      size="40"
                      color="black"
                      className="p-2 rounded-md border-[1.8px] border-black cursor-pointer report"
                      onClick={() => {
                        setTab(0);
                        setIsOpen(true);
                        setProcessData(e ?? null);
                      }}
                    />
                    <Tooltip anchorSelect=".report" place="top">
                      {t('processChainDialog.viewReport')}
                    </Tooltip>
                  </>
                </>
              ) : (
                <Button
                  title={t('processChainDialog.enableProcess')}
                  onClick={() => {
                    handleToggleProcessStatus(e?.dag_id);
                    toast.info(
                      t('processChainDialog.progressEnablingProcess'),
                      {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      }
                    );
                  }}
                >
                  <span>{t('processChainDialog.enableProcess')}</span>
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      ));
  };

  const [tab, setTab] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [processData, setProcessData] = useState<DagDetails | null>(null);
  const [runProcessById] = useRunProcessByIdMutation();
  const [toggleProcessStatus] = useToggleProcessStatusMutation();

  const handleRunProcess = (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    dagId: string
  ) => {
    event.stopPropagation();
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
        {isLoading && (
          <div className="flex h-96 bg-white shadow-md border rounded-md items-center justify-center">
            <div className="w-16 h-16">
              <Loader />
            </div>
          </div>
        )}
        {isSuccess && pipelineList && (
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
