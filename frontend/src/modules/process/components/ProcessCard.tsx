import { ShowMessage } from "@/common/components/ShowMessage";
import { Disclosure } from "@headlessui/react";
import {
  Badge,
  Button,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Card,
  List,
  ListItem,
  Title,
} from "@tremor/react";
import { DagDetails } from "../interface";
import { BiChart, BiGitMerge, BiTable } from "react-icons/bi";
import { AiOutlineSchedule } from "react-icons/ai";
import { useGetProcessHistoryByIdQuery } from "../process";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
interface IProcessCard {
  process: DagDetails;
}

const steps = [
  {
    title: "Data Source Selection",
    icon: <BiGitMerge />,
  },
  {
    title: "Orchestration",
    icon: <AiOutlineSchedule />,
  },
  {
    title: "Analytics Data Model",
    icon: <BiTable />,
  },
  {
    title: "Charts",
    icon: <BiChart />,
  },
];

export default function ProcessCard({ process }: IProcessCard) {
  const { data, isSuccess } = useGetProcessHistoryByIdQuery(process.dag_id);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Accordion defaultOpen={true}>
        <Disclosure.Button
          disabled={true}
          as="div"
          className="w-full flex items-center justify-between text-tremor-content-emphasis pr-9 m-3"
        >
          <div className="w-fulL flex justify-between">
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
                <Badge className="bg-gray-100 text-prim rounded-full p-1 px-3">
                  {process.status && <span> active </span>}
                </Badge>
              </span>
            </span>
            <span className="flex space-x-3 p-3 mr-7">
              <Button variant="secondary" color="gray">
                Load Data
              </Button>
              <Button
                variant="secondary"
                color="green"
                onClick={() => {
                  console.log("EEE");
                }}
              >
                Run
              </Button>
              <Button variant="secondary">View</Button>
              <Button variant="secondary" color="red">
                Disable
              </Button>
            </span>

            <ChevronRightIcon
              className={
                open ? "ui-open:rotate-90 transform w-4" : "transform w-4"
              }
              onClick={() => {
                console.log(open);
                setOpen(!open);
              }}
            />
          </div>
        </Disclosure.Button>
        {open && (
          <AccordionBody>
            <div className="flex flex-col">
              <div className="flex justify-center space-x-10">
                {steps.map((step) => {
                  return (
                    <div key={step.title} className="p-2 flex space-x-2">
                      <span>{step.icon}</span>
                      <span>{step.title}</span>
                    </div>
                  );
                })}
              </div>
              {isSuccess && (
                <div>
                  <Title>Last Execution</Title>
                  <List>
                    {data.dag_runs.map((dagRun) => {
                      return (
                        <ListItem key={dagRun.dag_run_id}>
                          <span>{dagRun.dag_run_id}</span>
                          <span>{dagRun.status}</span>
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              )}
            </div>
          </AccordionBody>
        )}
      </Accordion>
    </div>
  );
}
