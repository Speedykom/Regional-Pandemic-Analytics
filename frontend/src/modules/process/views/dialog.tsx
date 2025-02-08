import { Dialog, Transition } from '@headlessui/react';
import { Tab, TabGroup, TabList } from '@tremor/react';
import { Fragment } from 'react';

import { useTranslation } from 'react-i18next';
import punycode from 'punycode';
import { DagDetails } from '../interface';
import Charts from '../components/StepperElements/Charts';
import DetailsTab from '../components/StepperElements/DetailsTab';
import OrchestrationTab from '../components/StepperElements/OrchestrationTab';

export default function ProcessChainDialog({
  isOpen,
  setIsOpen,
  tab,
  setTab,
  processData,
  chartTabIsActive,
  setChartTabIsActive,
  reportTabIsActive,
  setReportTabIsActive,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
  processData: DagDetails;
  chartTabIsActive: boolean;
  setChartTabIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  reportTabIsActive: boolean;
  setReportTabIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const processName = punycode.toUnicode(processData?.dag_id ?? '');
  function closeModal() {
    setIsOpen(false);
    setChartTabIsActive(false);
    setReportTabIsActive(false);
  }
  const { t } = useTranslation();
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
                    {t('processChainDialog.processChainText')} {processName}
                  </h1>
                  {chartTabIsActive && (
                    <TabGroup index={tab} onIndexChange={setTab}>
                      <TabList variant="solid">
                        <Tab className="p-1">
                          <p className="text-black text-base px-4">
                            {t('processChainDialog.relatedCharts')}
                          </p>
                        </Tab>
                      </TabList>
                    </TabGroup>
                  )}
                  {reportTabIsActive && (
                    <TabGroup index={tab} onIndexChange={setTab}>
                      <TabList variant="solid">
                        <Tab className="p-1">
                          <p className="text-black text-base px-4">
                            {t('processChainDialog.orchestration')}
                          </p>
                        </Tab>
                        <Tab className="p-1">
                          <p className="text-black text-base px-4">
                            {t('processChainDialog.details')}
                          </p>
                        </Tab>
                      </TabList>
                    </TabGroup>
                  )}
                  <>
                    {chartTabIsActive && tab === 0 && (
                      <div className="py-4">
                        <Charts
                          dagId={processData?.dag_id}
                          createChartUrl={processData?.dataset_url}
                        />
                      </div>
                    )}
                    {reportTabIsActive && (
                      <>
                        {tab === 0 && (
                          <OrchestrationTab dagId={processData?.dag_id} />
                        )}
                        {tab === 1 && (
                          <DetailsTab dagId={processData?.dag_id} />
                        )}
                      </>
                    )}
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
