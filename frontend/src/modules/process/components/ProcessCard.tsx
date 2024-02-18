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

import { PipelineList } from '@/modules/pipeline/interface';
interface ProcessCardProps {
  process: DagDetails;
  pipelineList: PipelineList;
}

export default function ProcessCard({
  process,
  pipelineList,
}: ProcessCardProps) {
  const { t } = useTranslation();

  const { data, isSuccess, refetch } = useGetProcessPipelineByIdQuery(
    process.dag_id
  );
  const [runProcessById] = useRunProcessByIdMutation();
  const [toggleProcessStatus] = useToggleProcessStatusMutation();

  const [open, setOpen] = useState(false);

  const dateProcess = new Date(process.start_date);

  return (
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
          <div className="w-full flex justify-between items-center">
            <div className="flex space-x-10 ml-3">
              <div>
                <div className="mb-2 text-xs font-bold">
                  {t('addProcess.name')}
                </div>
                <Badge className="bg-gray-100 text-prim rounded-full p-1 px-3">
                  {process.name}
                </Badge>
              </div>
              <div>
                <div className="mb-2 text-xs font-bold">
                  {t('addProcess.scheduleIntervalLabel')}
                </div>
                <Badge className="bg-gray-100 text-prim rounded-full p-1 px-3">
                  {process.schedule_interval}
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
            </div>
            <div className="flex space-x-3 p-3 mt-4">
              {!process.status && (
                <Button
                  variant="secondary"
                  color="green"
                  disabled={
                    !isNaN(dateProcess.getTime()) && dateProcess > new Date()
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
                pipeline={data.pipeline}
                pipelineList={pipelineList}
                dagId={process.dag_id}
                refetch={refetch}
                description={process.description}
                nextDagRun={process.next_dagrun}
                lastParsedTime={process.last_parsed_time}
                createChartUrl={process.dataset_url}
              />
            </div>
          </AccordionBody>
        )}
      </Accordion>
    </div>
  );
}
