import { Dialog, Transition } from '@headlessui/react';
import { Card, Tab, TabGroup, TabList } from '@tremor/react';
import { Fragment, useState } from 'react';
import { GoVerified } from 'react-icons/go';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { TfiReload } from 'react-icons/tfi';

export default function ProcessChainDialog() {
  let [isOpen, setIsOpen] = useState<boolean>(true);
  const [tab, setTab] = useState<string>('1');

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
                  <h1 className="text-4xl text-center my-6 text-[#4B4B4B] font-semibold">
                    Process Chain: covid-dag-id{' '}
                  </h1>
                  <TabGroup>
                    <TabList variant="solid">
                      <Tab
                        value="1"
                        onClick={() => setTab('1')}
                        className="p-1"
                      >
                        <p className="text-black text-base px-4">
                          Orchestration
                        </p>
                      </Tab>
                      <Tab
                        value="2"
                        onClick={() => setTab('2')}
                        className="p-1"
                      >
                        <p className="text-black text-base px-4">Details</p>
                      </Tab>
                      <Tab
                        value="3"
                        onClick={() => setTab('3')}
                        className="p-1"
                      >
                        <p className="text-black text-base px-4">
                          Related Charts
                        </p>
                      </Tab>
                    </TabList>
                  </TabGroup>
                  <>
                    {tab === '1' ? (
                      <OrchestrationTab />
                    ) : tab === '2' ? (
                      <DetailsTab />
                    ) : tab === '3' ? (
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
      <div className="text-[#4B4B4B] mt-3 mb-7 text-xl font-medium">
        Last Executions
      </div>
      <div className="flex flex-row gap-x-4 mb-10">
        <div className="flex flex-col gap-y-2">
          {executions.map((execution, index) => (
            <div
              key={index}
              className={`${
                execution.verified
                  ? 'bg-[#00764B] text-white px-2 py-3 w-56 flex flex-row gap-x-2 rounded-md'
                  : 'bg-white text-[#00764B] px-2 py-3 w-56 flex flex-row gap-x-2 rounded-md'
              }`}
            >
              <p>{execution.date}</p>
              {execution.verified ? (
                <GoVerified size={20} />
              ) : (
                <IoMdCloseCircleOutline size={20} />
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
  return <></>;
}

function RelatedChartsTab() {
  return <></>;
}
