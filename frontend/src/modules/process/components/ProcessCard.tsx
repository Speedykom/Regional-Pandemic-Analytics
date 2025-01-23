import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { AiOutlineStop, AiOutlinePieChart } from 'react-icons/ai';
import { TbReportSearch } from 'react-icons/tb';
import { Tooltip } from 'react-tooltip';
import { Button, TableCell, TableRow } from '@tremor/react';
import { toast } from 'react-toastify';
import { DagDetails } from '../interface';

interface ProcessCardProps {
  paginatedProcesses: DagDetails[];
  showDisabled: boolean;
  t: (key: string) => string;
  handleRunProcess: (dagId: string) => void;
  handleToggleProcessStatus: (dagId: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  setProcessData: (data: any) => void;
  setChartTabIsActive: (isOpen: boolean) => void;
  setReportTabIsActive: (isOpen: boolean) => void;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  paginatedProcesses,
  showDisabled,
  t,
  handleRunProcess,
  handleToggleProcessStatus,
  setIsOpen,
  setProcessData,
  setChartTabIsActive,
  setReportTabIsActive,
}) => {
  if (!paginatedProcesses) return null;
  return (
    <>
      {paginatedProcesses
        .filter((e) => (showDisabled ? !e.status : e.status))
        .map((e, k) => (
          <TableRow key={k} className="border-[1px] border-[#E4E7EC]">
            <TableCell className="text-black">{e?.name}</TableCell>
            <TableCell className="text-blue-700 underline font-normal">
              {e?.data_source_name}
            </TableCell>
            <TableCell>
              {e?.schedule_interval === '@once'
                ? t('schedule_intervals.once')
                : e?.schedule_interval === '@hourly'
                ? t('schedule_intervals.hourly')
                : e?.schedule_interval === '@daily'
                ? t('schedule_intervals.daily')
                : e?.schedule_interval === '@weekly'
                ? t('schedule_intervals.weekly')
                : e?.schedule_interval === '@monthly'
                ? t('schedule_intervals.monthly')
                : e?.schedule_interval === '@yearly'
                ? t('schedule_intervals.yearly')
                : t('schedule_intervals.default')}
            </TableCell>
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
                        onClick={() => handleRunProcess(e?.dag_id)}
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
                          setChartTabIsActive(true);
                          setIsOpen(true);
                          setProcessData(e ?? null);
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
                          setReportTabIsActive(true);
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
        ))}
    </>
  );
};

export default ProcessCard;
