import { Title, Card } from '@tremor/react';
import { RadioGroup } from '@headlessui/react';
import { DagRun } from '../../interface';
import { useGetProcessHistoryByIdQuery } from '../../process';
import { useState } from 'react';

interface IHistroyProps {
  dagId: string;
}

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function History({ dagId }: IHistroyProps) {
  const { data, isSuccess } = useGetProcessHistoryByIdQuery(dagId);

  const [selected, setSelected] = useState('');

  return (
    <div>
      <Title>Last Execution</Title>
      <div className="flex space-x-4">
        <div>
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
                              <CheckIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
            </div>
          </RadioGroup>
        </div>
        <div className="grow">
          <Card className="h-72"></Card>
        </div>
      </div>
    </div>
  );
}
