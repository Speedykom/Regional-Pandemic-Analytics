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
import { useGetProcessQuery } from '../process';
import { DagDetails, DagDetailsResponse } from '../interface';
import ProcessCard from '../components/ProcessCard';
import { AddProcess } from './add';
import { useGetAllPipelinesQuery } from '@/modules/pipeline/pipeline';
import { useTranslation } from 'react-i18next';
import { Switch } from '@tremor/react';
import { FaPlay } from 'react-icons/fa6';
import { AiOutlinePieChart, AiOutlineStop } from 'react-icons/ai';
import { TbReportSearch } from 'react-icons/tb';

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

    var processChainToShowLength = 0;
    if (showDisabled) {
      processChainToShowLength = processChainList?.dags?.length;
    } else {
      processChainToShowLength = processChainList.dags.filter(
        (dag) => dag.status == false
      ).length;
    }

    const totalPages = Math.ceil(processChainToShowLength / defaultPageSize);
    const startItem = (currentPage - 1) * defaultPageSize + 1;
    const endItem = Math.min(
      currentPage * defaultPageSize,
      processChainToShowLength
    );
    return (
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
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderProcessChainData = (processChainList: DagDetails[]) => {
    var processChainToShow = null;
    if (!showDisabled) {
      processChainToShow = processChainList.filter(
        (dag) => dag.status == false
      );
    } else {
      processChainToShow = processChainList;
    }
    if (!defaultPageSize && !!pipelineList) {
      return processChainToShow.map((process) => {
        return (
          <ProcessCard
            key={process.dag_id}
            process={process}
            pipelineList={pipelineList}
            showDisabled={showDisabled}
            latest_dag_run_status={process.latest_dag_run_status || null}
          />
        );
      });
    }

    const startIndex = (currentPage - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    if (!!pipelineList) {
      return processChainToShow?.slice(startIndex, endIndex).map((process) => {
        return (
          <ProcessCard
            key={process.dag_id}
            process={process}
            pipelineList={pipelineList}
            showDisabled={showDisabled}
            latest_dag_run_status={process.latest_dag_run_status || null}
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
                    Process Chain Name
                  </TableHeaderCell>
                  <TableHeaderCell className="text-[#475467]">
                    Data Pipeline
                  </TableHeaderCell>
                  <TableHeaderCell className="text-[#475467]">
                    Periodicity
                  </TableHeaderCell>
                  <TableHeaderCell className="text-[#475467]">
                    Process Status
                  </TableHeaderCell>
                  <TableHeaderCell className="text-[#475467]">
                    Execution State
                  </TableHeaderCell>
                  <TableHeaderCell className="w-1/4 border-[#E4E7EC] border-l-[1px] text-[#475467]">
                    Actions
                  </TableHeaderCell>
                </TableHead>
                <TableBody>
                  {data?.dags.map((e, k) => (
                    <TableRow key={k} className="border-[1px] border-[#E4E7EC]">
                      <TableCell className="text-black">{e?.name}</TableCell>
                      <TableCell className="text-blue-700 underline font-normal">
                        {e?.data_source_name}
                      </TableCell>
                      <TableCell>{e?.schedule_interval}</TableCell>
                      <TableCell className="my-auto">
                        {e?.status ? (
                          <>
                            <span className="text-2xl text-green-700">•</span>{' '}
                            <span className="!font-medium">Active</span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl text-red-700">•</span>{' '}
                            <span className="!font-medium">Disabled</span>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {e.dataset_success ? (
                          <Button className="bg-transparent py-3 hover:bg-transparent text-green-700 border-green-700 hover:border-green-700">
                            Success
                          </Button>
                        ) : (
                          <Button className="bg-transparent py-3 hover:bg-transparent text-red-700 border-red-700 hover:border-red-700">
                            Failed
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="border-[#E4E7EC] border-l-[1px]">
                        <div className="flex flex-row gap-x-2">
                          <FaPlay
                            size="40"
                            color="#15803d"
                            className="p-2 rounded-md border-[1.8px] border-green-700"
                          />
                          <AiOutlineStop
                            size="40"
                            color="#b91c1c"
                            className="p-2 rounded-md border-[1.8px] border-red-700"
                          />
                          <AiOutlinePieChart
                            size="40"
                            color="black"
                            className="p-2 rounded-md border-[1.8px] border-black"
                          />
                          <TbReportSearch
                            size="40"
                            color="black"
                            className="p-2 rounded-md border-[1.8px] border-black"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
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
