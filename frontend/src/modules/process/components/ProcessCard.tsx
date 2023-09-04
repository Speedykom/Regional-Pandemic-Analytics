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
import { PipelineList } from '@/modules/pipeline/interface';
interface ProcessCardProps {
  process: DagDetails;
  pipelineList: PipelineList;
}

export default function ProcessCard({
  process,
  pipelineList,
}: ProcessCardProps) {
  const { data, isSuccess, refetch } = useGetProcessPipelineByIdQuery(
    process.dag_id
  );
  const [runProcessById] = useRunProcessByIdMutation();
  const [toggleProcessStatus] = useToggleProcessStatusMutation();

  const [open, setOpen] = useState(false);
  return (
    <div>
      <Accordion defaultOpen={true}>
        <Disclosure.Button
          disabled={true}
          as="div"
          className="w-full flex items-center justify-between text-tremor-content-emphasis pr-9 m-3"
        >
          <div className="w-fulL flex justify-between items-center">
            <span className="flex space-x-10 ml-3">
              <span>
                <div className="mb-2 text-xs font-bold">Name</div>
                <Badge className="bg-gray-100 text-prim rounded-full p-1 px-3">
                  {process.name}
                </Badge>
              </span>
              <span>
                <div className="mb-2 text-xs font-bold">Schedule Interval</div>
                <Badge className="bg-gray-100 text-prim rounded-full p-1 px-3">
                  {process.schedule_interval}
                </Badge>
              </span>
              <span>
                <div className="mb-2 text-xs font-bold">Status</div>
                {process.status ? (
                  <Badge className="bg-red-100 text-red-500 rounded-full p-1 px-3">
                    <span>inactive</span>
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-prim rounded-full p-1 px-3">
                    <span>active</span>
                  </Badge>
                )}
              </span>
            </span>
            <span className="flex space-x-3 p-3 mr-7">
              {!process.status && (
                <Button
                  variant="secondary"
                  color="green"
                  onClick={() => {
                    runProcessById(process.dag_id);
                  }}
                >
                  Run
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
                  Enable
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  color="red"
                  onClick={() => {
                    toggleProcessStatus(process.dag_id);
                  }}
                >
                  Disable
                </Button>
              )}
            </span>

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
              />
            </div>
          </AccordionBody>
        )}
      </Accordion>
    </div>
  );
}
