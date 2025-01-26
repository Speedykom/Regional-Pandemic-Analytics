import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TfiReload } from 'react-icons/tfi';
import { FaExclamationCircle } from 'react-icons/fa';
import { GoVerified } from 'react-icons/go';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import {
  useGetProcessHistoryByIdQuery,
  useGetProcessHistoryTasksbyIdQuery,
} from '../../process';
import { Card } from '@tremor/react';
function OrchestrationTab({ dagId }: { dagId: string }) {
  const { data: executions } = useGetProcessHistoryByIdQuery(dagId);
  const [selectedExecutionId, setSelectedExecutionId] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    if (executions?.dag_runs && executions.dag_runs.length > 0) {
      const lastExecution = executions.dag_runs[executions.dag_runs.length - 1];
      setSelectedExecutionId(lastExecution.dag_run_id);
    }
  }, [executions]);

  const convertDateString = (dateString: string) => {
    const datePart = dateString.split('__')[1];
    const date = new Date(datePart);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleExecutionClick = (executionId: string) => {
    setSelectedExecutionId(executionId);
  };

  const {
    data: stepsData,
    isLoading,
    refetch,
  } = useGetProcessHistoryTasksbyIdQuery(
    {
      dag_id: dagId,
      dag_run_id: selectedExecutionId,
    },
    {
      skip: !selectedExecutionId,
    }
  );

  const renderStepsList = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <TfiReload size={35} className="animate-spin text-[#00764B]" />
        </div>
      );
    }

    if (!stepsData || (Array.isArray(stepsData) && stepsData.length === 0)) {
      return (
        <div className="flex items-center justify-center w-full h-full text-[#4B4B4B]">
          No steps available for this execution.
        </div>
      );
    }

    const steps = Array.isArray(stepsData) ? stepsData : [stepsData];
    return (
      <ol className="flex items-center w-[800px] mx-10">
        {steps[0]?.tasks?.map((step: any, index: number) => {
          const isNextStepFailing =
            steps[0]?.tasks[index + 1]?.state !== 'success';

          return (
            <li key={index} className="flex w-full flex-col">
              <div
                className={`flex items-center w-full ${
                  index < steps[0]?.tasks?.length - 1
                    ? `after:content-[''] after:w-full after:h-1 after:border-b ${
                        isNextStepFailing
                          ? 'after:border-red-600'
                          : 'after:border-[#00764B]'
                      } after:border-4 after:inline-block`
                    : ''
                }`}
              >
                {step.state === 'success' ? (
                  <span className="flex items-center justify-center w-8 h-8 bg-[#00764B] rounded-full shrink-0">
                    <svg
                      className="w-3 h-3 text-white lg:w-4 lg:h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 12"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5.917 5.724 10.5 15 1.5"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full shrink-0">
                    <FaExclamationCircle className="text-white w-4 h-4" />
                  </span>
                )}
              </div>
              <div className="text-sm font-medium relative right-5 text-[#4B4B4B] mt-2">
                {step?.task_id}
              </div>
            </li>
          );
        })}
      </ol>
    );
  };

  return (
    <div>
      <div className="text-[#4B4B4B] text-xl font-medium py-2">
        {t('processChainDialog.lastExec')}
      </div>
      <div className="flex flex-row gap-x-4">
        <div className="flex flex-col gap-y-2">
          {executions?.dag_runs?.map((execution) => (
            <div
              key={execution.dag_run_id}
              onClick={() => handleExecutionClick(execution.dag_run_id)}
              className={`cursor-pointer ${
                selectedExecutionId === execution.dag_run_id
                  ? 'bg-[#00764B] text-white'
                  : 'bg-white text-[#4B4B4B] shadow-md'
              } px-2 py-3 w-56 flex flex-row gap-x-2 rounded-md`}
            >
              <p>{convertDateString(execution.dag_run_id)}</p>
              {execution.state === 'success' ? (
                <GoVerified size={20} />
              ) : (
                <IoMdCloseCircleOutline color="red" size={20} />
              )}
            </div>
          ))}
        </div>
        <div>
          <Card>
            <div className="flex flex-row gap-y-2 items-center justify-center h-[300px]">
              {renderStepsList()}
              <TfiReload
                onClick={refetch}
                size={35}
                color="white"
                className="bg-[#00764B] m-2 p-2 rounded-md cursor-pointer"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrchestrationTab;
