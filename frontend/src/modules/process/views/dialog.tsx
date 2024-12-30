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
import { Fragment, useState } from 'react';
import { GoVerified } from 'react-icons/go';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { TfiReload } from 'react-icons/tfi';
import { IoSearch } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { AiOutlinePieChart } from 'react-icons/ai';
import punycode from 'punycode';
import { useGetChartsQuery } from '@/modules/superset/superset';
import { DagDetails } from '../interface';
import { ChartList } from '@/modules/superset/views/ListChart';

export default function ProcessChainDialog({
  isOpen,
  setIsOpen,
  tab,
  setTab,
  processData,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
  processData: DagDetails | null;
}) {
  const processName = punycode.toUnicode(processData?.dag_id ?? '');
  function closeModal() {
    setIsOpen(false);
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
                          {t('processChainDialog.orchestration')}
                        </p>
                      </Tab>
                      <Tab
                        value={2}
                        onClick={() => setTab(2)}
                        className={`p-1 ${tab === 2 ? '' : ''}`}
                      >
                        <p className="text-black text-base px-4">
                          {t('processChainDialog.details')}
                        </p>
                      </Tab>
                      <Tab
                        value={3}
                        onClick={() => {
                          setTab(3);
                        }}
                        className={`p-1 ${tab === 3 ? '' : ''}`}
                      >
                        <p className="text-black text-base px-4">
                          {t('processChainDialog.relatedCharts')}
                        </p>
                      </Tab>
                    </TabList>
                  </TabGroup>
                  <>
                    {tab == 1 ? (
                      <OrchestrationTab />
                    ) : tab == 2 ? (
                      <DetailsTab processData={processData} />
                    ) : tab == 3 ? (
                      <div className="py-4">
                        <ChartList filterByDagId={processData?.dag_id} />
                      </div>
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

  const { t } = useTranslation();

  return (
    <div>
      <div className="text-[#4B4B4B]  text-xl font-medium py-2">
        {t('processChainDialog.lastExec')}
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

function DetailsTab({ processData }: { processData: any }) {
  const { t } = useTranslation();

  const data = [
    { label: t('processChainDialog.modelName'), value: processData.dag_id },
    {
      label: t('processChainDialog.modelCreatedAt'),
      value: new Date(processData?.properties?.created).toLocaleString(),
    },
    {
      label: t('processChainDialog.modelSegmentCount'),
      value: processData.segments_count,
    },
    {
      label: t('processChainDialog.modelDimensions'),
      value: processData?.last_segment?.dimensions?.join(', '),
    },
    {
      label: t('processChainDialog.modelTotalSize'),
      value: processData?.total_size,
    },
    { label: t('processChainDialog.modelDescription'), value: null },
    {
      label: t('processChainDialog.modelLastUpdate'),
      value: new Date(processData?.last_segment?.version).toLocaleString(),
    },
    { label: t('processChainDialog.modelStatus'), value: processData.status },
    {
      label: t('processChainDialog.modelLastDagRun'),
      value: processData.latest_dag_run_status || null,
    },
  ];

  return (
    <>
      <div className="text-[#4B4B4B] mt-3 mb-4 text-xl font-medium">
        {t('processChainDialog.dataModelInfo')}
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RelatedChartsTab({
  filterByDagId,
}: {
  filterByDagId: string | undefined;
}) {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Assuming useGetChartsQuery is similar to the original code's query hook
  const { data } = useGetChartsQuery(searchInput);

  let filteredCharts: any = { result: [] };

  // Filter charts based on dagId if provided
  if (data?.result && filterByDagId) {
    const filtered = data.result.filter((element: any) => {
      const dagId = element.datasource_name_text.split('druid.')[1];
      return dagId === filterByDagId;
    });
    filteredCharts = { ...data, result: filtered };
  } else if (data?.result) {
    filteredCharts = data;
  }

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = filteredCharts.result.slice(
    firstItemIndex,
    lastItemIndex
  );
  const totalPages = Math.ceil(filteredCharts.result.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

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
              placeholder={t('searchForCharts')}
              className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <Card className="p-0 my-1">
          <Table>
            <TableHead className="bg-[#F9FAFB]">
              <TableRow>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  {t('chartTitle')}
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  {t('visualizationType')}
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  {t('dataset')}
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  {t('createdBy')}
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  {t('createdOn')}
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  {t('modifiedBy')}
                </TableHeaderCell>
                <TableHeaderCell className="text-[#475467] font-semibold">
                  {t('lastModified')}
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="text-black underline">
                    <a
                      href={`${process.env.NEXT_PUBLIC_SUPERSET_URL}${
                        item.slice_url || '#'
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.slice_name}
                    </a>
                  </TableCell>
                  <TableCell className="text-black">{item.viz_type}</TableCell>
                  <TableCell className="text-black">
                    {item.datasource_name_text}
                  </TableCell>
                  <TableCell className="text-black">{`${item.created_by?.first_name} ${item.created_by?.last_name}`}</TableCell>
                  <TableCell className="text-black">
                    {item.created_on_delta_humanized}
                  </TableCell>
                  <TableCell className="text-black">{`${item.changed_by?.first_name} ${item.changed_by?.last_name}`}</TableCell>
                  <TableCell className="text-black">
                    {item.changed_on_delta_humanized}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="flex justify-end items-center mt-4">
          <Button
            onClick={prevPage}
            className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer mr-2"
            size="xs"
            disabled={currentPage === 1}
          >
            ← {t('prev')}
          </Button>
          <Button
            onClick={nextPage}
            className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4 focus:outline-none cursor-pointer"
            size="xs"
            disabled={currentPage === totalPages}
          >
            {t('next')} →
          </Button>
        </div>

        <div className="flex justify-end items-center mt-2">
          <Button className="text-white py-2 px-4 rounded">
            <span className="tremor-Button-text text-sm whitespace-nowrap flex items-center gap-2">
              <AiOutlinePieChart size={20} />
              <span>{t('processChainDialog.addChart')}</span>
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
