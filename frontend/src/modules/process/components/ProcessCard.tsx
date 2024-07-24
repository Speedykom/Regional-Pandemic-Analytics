import { Disclosure } from '@headlessui/react';
import { Badge, Button, Accordion, AccordionBody } from '@tremor/react';
import { DagDetails } from '../interface';
import {
  useGetProcessPipelineByIdQuery,
  useRunProcessByIdMutation,
  useToggleProcessStatusMutation,
} from '../process';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Stepper from './Stepper';
import { useTranslation } from 'react-i18next';
import punycode from 'punycode';

import { PipelineList } from '@/modules/pipeline/interface';
interface ProcessCardProps {
  process: DagDetails;
  pipelineList: PipelineList;
  showDisabled: boolean;
  latest_dag_run_status: string | null;
}

export default function ProcessCard({
  process,
  pipelineList,
  showDisabled,
  latest_dag_run_status,
}: ProcessCardProps) {
  const { t } = useTranslation();

  const { data, isSuccess, refetch } = useGetProcessPipelineByIdQuery(
    process.dag_id
  );
  const [runProcessById] = useRunProcessByIdMutation();
  const [toggleProcessStatus] = useToggleProcessStatusMutation();

  const [open, setOpen] = useState(false);

  const dateProcess = new Date(process.start_date);
  const processName = punycode.toUnicode(process.dag_id);

  return (
    <>
      {(showDisabled || !process.status) && (
        <div className="mb-2">
          <Accordion
            defaultOpen={true}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <Disclosure.Button
              disabled={true}
              as="div"
              className="w-full flex items-center justify-between text-tremor-content-emphasis pr-9 rounded-lg"
            >
              <div className="flex w-full justify-between items-center">
                <div className="flex space-x-10 ml-3">
                  <div>
                    <div className="mb-2 text-xs font-bold">
                      {t('addProcess.name')}
                    </div>
                    <Badge className="bg-gray-100 text-prim rounded-full p-1 px-3">
                      {processName}
                    </Badge>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-bold">
                      {t('addProcess.scheduleIntervalLabel')}
                    </div>
                    <Badge className="bg-gray-100 text-prim rounded-full p-1 px-3">
                      {process.schedule_interval === '@once' ? (
                        t('schedule_intervals.once')
                      ) : process.schedule_interval === '@hourly' ? (
                        t('schedule_intervals.hourly')
                      ) : process.schedule_interval === '@daily' ? (
                        t('schedule_intervals.daily')
                      ) : process.schedule_interval === '@weekly' ? (
                        t('schedule_intervals.weekly')
                      ) : process.schedule_interval === '@monthly' ? (
                        t('schedule_intervals.monthly')
                      ) : process.schedule_interval === '@yearly' ? (
                        t('schedule_intervals.yearly')
                      ) : (
                        <div>Default case</div>
                      )}
                    </Badge>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-bold">
                      {t('addProcess.status')}
                    </div>
                    {process.status ? (
                      <Badge className="bg-red-100 text-red-500 rounded-full p-1 px-3">
                        <span>{t('addProcess.inactive')}</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-prim rounded-full p-1 px-3">
                        <span>{t('addProcess.active')}</span>
                      </Badge>
                    )}
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-bold">
                      {t('addProcess.latestDagRunStatus')}
                    </div>
                    {latest_dag_run_status ? (
                      <Badge
                        className={`rounded-full p-1 px-3 ${
                          latest_dag_run_status === 'failed'
                            ? 'bg-red-100 text-red-500'
                            : latest_dag_run_status === 'success'
                            ? 'bg-green-100 text-green-500'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <span>{t(`addProcess.${latest_dag_run_status}`)}</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500 rounded-full p-1 px-3">
                        <span>{t('addProcess.unknown')}</span>
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3 p-3 mt-4">
                  {!process.status && (
                    <Button
                      variant="secondary"
                      color="green"
                      disabled={
                        !isNaN(dateProcess.getTime()) &&
                        dateProcess > new Date()
                          ? true
                          : false
                      }
                      onClick={() => {
                        runProcessById(process.dag_id);
                      }}
                    >
                      {t('addProcess.run')}{' '}
                    </Button>
                  )}

                  {process.status ? (
                    <Button
                      variant="secondary"
                      color="red"
                      onClick={() => {
                        toggleProcessStatus(process.dag_id);
                      }}
                    >
                      {t('addProcess.enable')}{' '}
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      color="red"
                      onClick={() => {
                        toggleProcessStatus(process.dag_id);
                      }}
                    >
                      {t('addProcess.disable')}{' '}
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <ChevronRightIcon
                  className={
                    open ? 'ui-open:rotate-90 transform w-4' : 'transform w-4'
                  }
                  onClick={() => {
                    setOpen(!open);
                  }}
                />
              </div>
            </Disclosure.Button>
            {open && isSuccess && (
              <AccordionBody>
                <div className="flex flex-col space-y-2 pt-2 px-10 pb-1">
                  <Stepper
                    pipeline={punycode.toUnicode(data.pipeline)}
                    pipelineList={pipelineList}
                    dagId={process.dag_id}
                    refetch={refetch}
                    description={process.description}
                    nextDagRun={process.next_dagrun}
                    lastParsedTime={process.last_parsed_time}
                    createChartUrl={process.dataset_url}
                    data_source_name={process.dag_id}
                  />
                </div>
              </AccordionBody>
            )}
          </Accordion>
        </div>
      )}
    </>
  );
}
