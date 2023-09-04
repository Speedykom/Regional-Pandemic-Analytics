import { BiChart, BiGitMerge, BiTable } from 'react-icons/bi';
import { AiOutlineSchedule } from 'react-icons/ai';
import React from 'react';
import { TabList, Tab, TabGroup, TabPanels, TabPanel } from '@tremor/react';
import DataSourceSelection from './StepperElements/DataSourceSelection';
import Orchestration from './StepperElements/Orchestration';
import { PipelineList } from '@/modules/pipeline/interface';

interface StepperProps {
  pipeline: string;
  pipelineList: PipelineList;
  dagId: string;
  description: string;
  nextDagRun: string;
  lastParsedTime: string;
}

export default function Stepper({
  pipeline,
  pipelineList,
  dagId,
  description,
  nextDagRun,
  lastParsedTime,
}: StepperProps) {
  const steps = [
    {
      title: 'Data Source Selection',
      icon: <BiGitMerge />,
    },
    {
      title: 'Orchestration',
      icon: <AiOutlineSchedule />,
    },
    {
      title: 'Analytics Data Model',
      icon: <BiTable />,
    },
    {
      title: 'Charts',
      icon: <BiChart />,
    },
  ];

  return (
    <div>
      <TabGroup>
        <TabList className="pl-40 pr-40 flex justify-around" color="green">
          {steps.map((step) => {
            return (
              <Tab key={step.title} className="px-5">
                <div className="flex space-x-2 items-center">
                  <span>{step.icon}</span>
                  <span>{step.title}</span>
                </div>
              </Tab>
            );
          })}
        </TabList>
        <TabPanels>
          <TabPanel className="px-20 pt-2">
            <DataSourceSelection
              dagId={dagId}
              pipeline={pipeline}
              pipelineList={pipelineList}
            />
          </TabPanel>
          <TabPanel className="px-20 pt-2">
            <Orchestration
              dagId={dagId}
              description={description}
              lastParsedTime={lastParsedTime}
              nextDagRun={nextDagRun}
            />
          </TabPanel>
          <TabPanel className="px-20 pt-2">C</TabPanel>
          <TabPanel className="px-20 pt-2">D</TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
