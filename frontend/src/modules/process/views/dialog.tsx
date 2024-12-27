import { Dialog, Transition } from '@headlessui/react';
import {
  Button,
  Card,
  Tab,
  TabGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TabList,
} from '@tremor/react';
import { Fragment } from 'react';
import { GoVerified } from 'react-icons/go';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { TfiReload } from 'react-icons/tfi';
import { IoSearch } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { AiOutlinePieChart } from 'react-icons/ai';

export default function ProcessChainDialog({
  isOpen,
  setIsOpen,
  tab,
  setTab,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
}) {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <h1 className="text-4xl text-center my-4 text-[#4B4B4B] font-semibold">
                    Process Chain: covid-dag-id{' '}
                  </h1>
                  <TabGroup>
                    <TabList variant="solid">
                      <Tab
                        value={1}
                        onClick={() => {
                          setTab(1);
                        }}
                        className={`p-1 ${tab === 1 ? '' : ''}`}
                      >
                        <p className="text-black text-base px-4">
                          Orchestration
                        </p>
                      </Tab>
                      <Tab
                        value={2}
                        onClick={() => setTab(2)}
                        className={`p-1 ${tab === 2 ? '' : ''}`}
                      >
                        <p className="text-black text-base px-4">Details</p>
                      </Tab>
                      <Tab
                        value={3}
                        onClick={() => {
                          setTab(3);
                        }}
                        className={`p-1 ${tab === 3 ? '' : ''}`}
                      >
                        <p className="text-black text-base px-4">
                          Related Charts
                        </p>
                      </Tab>
                    </TabList>
                  </TabGroup>
                  <>
                    {tab == 1 ? (
                      <OrchestrationTab />
                    ) : tab == 2 ? (
                      <DetailsTab />
                    ) : tab == 3 ? (
                      <RelatedChartsTab />
                    ) : null}
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function OrchestrationTab() {
  const executions = [
    { date: '11/12/2024 00:00:00 GMT', verified: true },
    { date: '11/12/2024 00:00:00 GMT', verified: false },
    { date: '11/12/2024 00:00:00 GMT', verified: false },
  ];

  const steps = [
    { label: 'Loading Pipeline', completed: true },
    { label: 'Executing Pipeline: group_2', completed: true },
    { label: 'Creating Data Source', completed: true },
    { label: 'Add the dataset to', completed: true },
  ];

  return (
    <div>
      <div className="text-[#4B4B4B]  text-xl font-medium py-2">
        Last Executions
      </div>
      <div className="flex flex-row gap-x-4">
        <div className="flex flex-col gap-y-2">
          {executions.map((execution, index) => (
            <div
              key={index}
              className={`${
                execution.verified
                  ? 'bg-[#00764B] text-white px-2 py-3 w-56 flex flex-row gap-x-2 rounded-md'
                  : 'bg-white text-[#4B4B4B] px-2 py-3 w-56 flex flex-row gap-x-2 rounded-md shadow-md'
              }`}
            >
              <p>{execution.date}</p>
              {execution.verified ? (
                <GoVerified size={20} />
              ) : (
                <IoMdCloseCircleOutline color="red" size={20} />
              )}
            </div>
          ))}
        </div>
        <div>
          <Card>
            <div className="flex flex-row gap-y-2 items-center justify-center h-[300px]">
              <ol className="flex items-center w-[800px] mx-10">
                {steps.map((step, index) => (
                  <li key={index} className="flex w-full flex-col">
                    <div
                      className={`flex items-center w-full ${
                        index < steps.length - 1
                          ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-[#00764B] after:border-4 after:inline-block"
                          : ''
                      }`}
                    >
                      <span className="flex items-center justify-center w-8 h-8 bg-[#00764B] rounded-full shrink-0">
                        <svg
                          className="w-3 h-3 text-white lg:w-4 lg:h-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 16 12"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5.917 5.724 10.5 15 1.5"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="text-sm font-medium relative right-5 text-[#4B4B4B] mt-2">
                      {step.label}
                    </div>
                  </li>
                ))}
              </ol>
              <TfiReload
                size={35}
                color="white"
                className="bg-[#00764B] m-2 p-2 rounded-md"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailsTab() {
  const data = [
    { label: 'Name', value: 'covid-dag-id' },
    { label: 'Created at', value: '2024-12-13T19:43:00.152Z' },
    { label: 'Segment Count', value: '12' },
    {
      label: 'Dimensions',
      value:
        'Name, Cases, OrgUnitLevel2Name, OrgUnitLevel2Geometry, OrgUnitLevel1Name',
    },
    { label: 'Total Size', value: '27166.517 Kb' },
    { label: 'Description', value: 'Test Groupe 2' },
    { label: 'Last update', value: 'Friday, 13 December 2024 19:16:42 GMT' },
  ];
  return (
    <>
      <div className="text-[#4B4B4B] mt-3 mb-4 text-xl font-medium">
        Data Model Information
      </div>
      <div className="flex flex-col gap-y-[1px]">
        {data.map((item, index) => (
          <div key={index} className="flex flex-row gap-x-[2px]">
            <div className="bg-[#00764B] w-[210px] h-11 flex items-center">
              <p className="text-white font-semibold px-3">{item.label}</p>
            </div>
            <div className="bg-[#F3F4F6] w-[600px] h-11 flex items-center">
              <p className="text-[#6B7280] px-3">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function RelatedChartsTab() {
  const { t } = useTranslation();
  const tableData = [
    {
      chartTitle: 'Residus',
      visualizationType: 'echarts_area',
      dataset: 'druid.ChaineResidus',
      createdBy: '1 day ago',
      createdOn: '',
      modifiedBy: '',
      lastModified: '1 day ago',
    },
    {
      chartTitle: 'Residus',
      visualizationType: 'echarts_area',
      dataset: 'druid.ChaineResidus',
      createdBy: '1 day ago',
      createdOn: '',
      modifiedBy: '',
      lastModified: '1 day ago',
    },
  ];

  return (
    <>
      <div>
        <div className="mt-2">
          <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
            <IoSearch />
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Search for charts..."
              className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
            />
          </div>
        </div>
        <Card className="p-0 my-1">
          <Table>
            <TableHead className="bg-[#F9FAFB]">
              <TableRow>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  Chart Title
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  Visualization Type
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  Dataset
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  Created By
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  Created On
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  Modified By
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  Last Modified
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="text-black underline">
                    {row.chartTitle}
                  </TableCell>
                  <TableCell className="text-black">
                    {row.visualizationType}
                  </TableCell>
                  <TableCell className="text-black">{row.dataset}</TableCell>
                  <TableCell className="text-black">{row.createdBy}</TableCell>
                  <TableCell className="text-black">{row.createdOn}</TableCell>
                  <TableCell className="text-black">{row.modifiedBy}</TableCell>
                  <TableCell className="text-black">
                    {row.lastModified}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <div className="flex justify-end items-center mt-4">
          <Button
            className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer mr-2"
            size="xs"
            disabled={true}
          >
            ← {t('prev')}
          </Button>
          <Button
            className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4 focus:outline-none cursor-pointer"
            size="xs"
            disabled={true}
          >
            {t('next')} →
          </Button>
        </div>
        <div className="flex justify-end items-center mt-2">
          <Button className="text-white py-2 px-4 rounded">
            <span className="tremor-Button-text text-sm whitespace-nowrap flex items-center gap-2">
              <AiOutlinePieChart size={20} />
              <span>Add a Chart</span>
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
