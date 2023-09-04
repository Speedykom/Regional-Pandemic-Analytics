import { DagRun } from '@/modules/process/interface';
import { useGetProcessHistoryByIdQuery } from '@/modules/process/process';
import { RadioGroup } from '@headlessui/react';
import { Dispatch, SetStateAction } from 'react';
import { BiCheckCircle } from 'react-icons/bi';

interface ListExecutionProps {
  dagId: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}

export default function ListExecution({
  dagId,
  selected,
  setSelected,
}: ListExecutionProps) {
  const { data, isSuccess } = useGetProcessHistoryByIdQuery(dagId);
  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <div className="space-y-2">
        {isSuccess &&
          data.dag_runs.map((dagRun: DagRun) => (
            <RadioGroup.Option
              key={dagRun.dag_run_id}
              value={dagRun.dag_run_id}
              className={({ active, checked }) =>
                `${
                  active
                    ? 'ring-2 ring-white ring-opacity-60 ring-offset-2'
                    : ''
                }
                  ${
                    checked
                      ? 'bg-green-600 bg-opacity-75 text-white'
                      : 'bg-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium  ${
                            checked ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {dagRun.dag_run_id}
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
          ))}
      </div>
    </RadioGroup>
  );
}
