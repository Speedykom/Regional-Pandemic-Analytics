import { BiChart, BiGitMerge, BiTable } from 'react-icons/bi';
import { AiOutlineSchedule } from 'react-icons/ai';
import React from 'react';
import { TabList, Tab, TabGroup, TabPanels, TabPanel } from '@tremor/react';

export default function Stepper() {
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
        <TabList
          className="pl-40 pr-40 flex justify-around"
          color="green"
          // variant="solid"
        >
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
          <TabPanel className="px-20 pt-2">A</TabPanel>
          <TabPanel className="px-20 pt-2">B</TabPanel>
          <TabPanel className="px-20 pt-2">C</TabPanel>
          <TabPanel className="px-20 pt-2">D</TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
