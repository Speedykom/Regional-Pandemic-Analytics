import { DagRun } from '@/modules/process/interface';
import { useGetProcessHistoryByIdQuery } from '@/modules/process/process';
import { RadioGroup } from '@headlessui/react';
import { Dispatch, SetStateAction } from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

interface ListExecutionProps {
  dagId: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}

const convertDagRunId = (dagRunId: string) =>
  dagRunId.includes('manual__')
    ? new Date(dagRunId.replace('manual__', ''))
    : new Date(dagRunId.replace('scheduled__', ''));

export default function ListExecution({
  dagId,
  selected,
  setSelected,
}: ListExecutionProps) {
  const { data, isSuccess } = useGetProcessHistoryByIdQuery(dagId);
  const { t } = useTranslation();

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <div className="space-y-2">
        {isSuccess &&
          data.dag_runs.map((dagRun: DagRun) => {
            return (
              <RadioGroup.Option
                key={dagRun.dag_run_id}
                value={dagRun.dag_run_id}
                className={({ checked }) =>
                  `
                  ${
                    checked
                      ? 'bg-green-600 bg-opacity-75 text-white'
                      : 'bg-gray-100 bg-opacity-25'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md `
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between space-x-2">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {t(
                              `days.${convertDagRunId(
                                dagRun.dag_run_id
                              ).getUTCDay()}`
                            )}
                            , {convertDagRunId(dagRun.dag_run_id).getUTCDate()}{' '}
                            {t(
                              `months.${convertDagRunId(
                                dagRun.dag_run_id
                              ).getUTCMonth()}`
                            )}{' '}
                            {convertDagRunId(
                              dagRun.dag_run_id
                            ).getUTCFullYear()}{' '}
                            {convertDagRunId(dagRun.dag_run_id)
                              .getUTCHours()
                              .toString()
                              .padStart(2, '0')}
                            :
                            {convertDagRunId(dagRun.dag_run_id)
                              .getUTCMinutes()
                              .toString()
                              .padStart(2, '0')}
                            :
                            {convertDagRunId(dagRun.dag_run_id)
                              .getUTCSeconds()
                              .toString()
                              .padStart(2, '0')}{' '}
                            GMT
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <BiCheckCircle />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            );
          })}
      </div>
    </RadioGroup>
  );
}
