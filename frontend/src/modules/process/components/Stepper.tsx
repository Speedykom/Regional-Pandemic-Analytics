import { BiChart, BiGitMerge, BiTable } from 'react-icons/bi';
import { AiOutlineSchedule } from 'react-icons/ai';
import React from 'react';
import { TabList, Tab, TabGroup, TabPanels, TabPanel } from '@tremor/react';
import DataSourceSelection from './StepperElements/DataSourceSelection';
import Orchestration from './StepperElements/Orchestration';
import { PipelineList } from '@/modules/pipeline/interface';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import AnalyticsDataModel from './StepperElements/AnalyticsDataModel';
import Charts from './StepperElements/Charts';

interface StepperProps {
  pipeline: string;
  pipelineList: PipelineList;
  dagId: string;
  refetch: () => QueryActionCreatorResult<any>;
  description: string;
  nextDagRun: string;
  lastParsedTime: string;
  createChartUrl: string | null;
}

export default function Stepper({
  pipeline,
  pipelineList,
  dagId,
  refetch,
  description,
  nextDagRun,
  lastParsedTime,
  createChartUrl
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
              refetch={refetch}
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
          <TabPanel className="px-20 pt-2">
            <AnalyticsDataModel />
          </TabPanel>
          <TabPanel className="px-20 pt-2">
            <Charts createChartUrl={createChartUrl} dagId={dagId} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
