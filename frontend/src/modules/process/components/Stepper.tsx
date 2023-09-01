import { BiChart, BiGitMerge, BiTable } from 'react-icons/bi';
import { AiOutlineSchedule } from 'react-icons/ai';
import React from 'react';
import {
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
  SearchSelect,
  SearchSelectItem,
} from '@tremor/react';

export default function Stepper({
  pipeline,
  pipelineList,
  description,
  nextDagRun,
  lastParsedTime,
}: any) {
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
          <TabPanel className="px-20 pt-2">
            <Table>
              <TableRow>
                <TableHeaderCell>Pipeline used</TableHeaderCell>
                <TableCell>{pipeline}</TableCell>
              </TableRow>
              <TableRow>
                <TableHeaderCell>Pipelines</TableHeaderCell>
                <TableCell>
                  <SearchSelect placeholder="Pipeline Template">
                    {pipelineList.data.map((pipeline: any) => {
                      return (
                        <SearchSelectItem
                          key={pipeline.name}
                          value={pipeline.name}
                        >
                          {pipeline.name}
                        </SearchSelectItem>
                      );
                    })}
                  </SearchSelect>
                </TableCell>
              </TableRow>
            </Table>
          </TabPanel>
          <TabPanel className="px-20 pt-2">
            <Table>
              <TableRow>
                <TableHeaderCell>description</TableHeaderCell>
                <TableCell className="whitespace-normal">
                  {description} hello there this is a basic description element
                  that should be working. By the way, have fun in the demo.
                  There is no description field in the Add component so please
                  remember to add it
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHeaderCell>Last update</TableHeaderCell>
                <TableCell className="whitespace-normal">
                  {lastParsedTime}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHeaderCell>Next scheduled execution</TableHeaderCell>
                <TableCell className="whitespace-normal">
                  {nextDagRun}
                </TableCell>
              </TableRow>
            </Table>
          </TabPanel>
          <TabPanel className="px-20 pt-2">C</TabPanel>
          <TabPanel className="px-20 pt-2">D</TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
