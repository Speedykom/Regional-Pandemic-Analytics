import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from '@tremor/react';
import Link from 'next/link';
import MediaQuery from 'react-responsive';
import { useGetChartsQuery } from '../superset';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const ChartList = () => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Adjusted to 5 items per page
  const { data } = useGetChartsQuery(searchInput);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = data?.result.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil((data?.result.length || 0) / itemsPerPage);

  const startItem = firstItemIndex + 1;
  const endItem = Math.min(lastItemIndex, data?.result.length || 0);

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div>
      <nav className="mb-5">
        <div>
          <h2 className="text-3xl">{t('supersetCharts')}</h2>
          <p className="mt-2 text-gray-600">
            {t('chartListCreatedOnSuperset')}
          </p>
        </div>
      </nav>
      <input
        type="text"
        placeholder="Search for charts..."
        className="w-full border border-gray-300 rounded-md p-2 mb-3"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Card className="bg-white">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>{t('chartTitle')}</TableHeaderCell>
              <MediaQuery minWidth={768}>
                <TableHeaderCell>{t('visualizationType')}</TableHeaderCell>
              </MediaQuery>
              <MediaQuery minWidth={1090}>
                <TableHeaderCell>{t('dataset')}</TableHeaderCell>
              </MediaQuery>
              <MediaQuery minWidth={1220}>
                <TableHeaderCell>{t('createdBy')}</TableHeaderCell>
              </MediaQuery>
              <MediaQuery minWidth={1350}>
                <TableHeaderCell>{t('createdOn')}</TableHeaderCell>
                <TableHeaderCell>{t('modifiedBy')}</TableHeaderCell>
              </MediaQuery>
              <TableHeaderCell className="text-right">
                {t('lastModified')}
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Text className="font-sans">{item.slice_name}</Text>
                </TableCell>
                <MediaQuery minWidth={768}>
                  <TableCell>
                    <Text>{item?.viz_type}</Text>
                  </TableCell>
                </MediaQuery>
                <MediaQuery minWidth={1090}>
                  <TableCell>
                    <Text>{item?.datasource_name_text}</Text>
                  </TableCell>
                </MediaQuery>
                <MediaQuery minWidth={1220}>
                  <TableCell>
                    <Text>
                      {item?.created_by?.first_name}{' '}
                      {item?.created_by?.last_name}
                    </Text>
                  </TableCell>
                </MediaQuery>
                <MediaQuery minWidth={1350}>
                  <TableCell>
                    <Text>{item?.created_on_delta_humanized}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>
                      {item?.changed_by?.first_name}{' '}
                      {item?.changed_by?.last_name}
                    </Text>
                  </TableCell>
                </MediaQuery>
                <TableCell>
                  <div className="flex space-x-2 justify-end">
                    <Text>{item?.changed_on_delta_humanized}</Text>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <div className="flex justify-end items-center mt-4">
        <div className="mr-4">
          Showing {startItem} – {endItem} of {data?.count}
        </div>
        <div className="flex">
          <Button
            onClick={prevPage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none mr-2"
            size="xs"
            disabled={currentPage === 1}
          >
            &larr; Prev
          </Button>
          <Button
            onClick={nextPage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none mr-2"
            size="xs"
            disabled={currentPage === totalPages}
          >
            Next &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
};
interface ProcessChainChartProps {
  dagId: string;
}
export const ProcessChainChartList = ({ dagId }: ProcessChainChartProps) => {
  const { t } = useTranslation();
  const { data } = useGetChartsQuery('');
  let processChainCharts: any;
  if (data?.result && dagId) {
    const filteredCharts = data.result.filter((element: any) =>
      element.datasource_name_text.endsWith(`.${dagId}`)
    );
    processChainCharts = { ...data, result: filteredCharts };
  }
  return (
    <div className="">
      <nav className="mb-5">
        <div>
          <h2 className="text-2xl">{t('Process Chain Charts')}</h2>
        </div>
      </nav>
      <div>
        <Card className="bg-white">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{t('chartTitle')}</TableHeaderCell>
                <MediaQuery minWidth={768}>
                  <TableHeaderCell className="">
                    {t('visualizationType')}
                  </TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1090}>
                  <TableHeaderCell className="">{t('dataset')}</TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1220}>
                  <TableHeaderCell className="">
                    {t('createdBy')}
                  </TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1350}>
                  <TableHeaderCell className="">
                    {t('createdOn')}
                  </TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1624}>
                  <TableHeaderCell className="">
                    {t('modifiedBy')}
                  </TableHeaderCell>
                </MediaQuery>
                <TableHeaderCell className="justify-end">
                  {t('lastModified')}
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processChainCharts?.result.map((item: any, index: any) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link
                      style={{ textDecoration: 'underline' }}
                      href={
                        process.env.NEXT_PUBLIC_SUPERSET_URL + item.slice_url
                      }
                      target="_blank"
                    >
                      {item.slice_name}
                    </Link>
                  </TableCell>
                  <MediaQuery minWidth={768}>
                    <TableCell className="">
                      <Text>{item?.viz_type}</Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1090}>
                    <TableCell className="">
                      <Text>{item?.datasource_name_text}</Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1220}>
                    <TableCell className="">
                      <Text>
                        {item?.created_by?.first_name}{' '}
                        {item?.created_by?.last_name}
                      </Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1350}>
                    <TableCell className="">
                      <Text>{item?.created_on_delta_humanized}</Text>
                    </TableCell>
                    <TableCell className="">
                      <Text>
                        {item?.changed_by?.first_name}{' '}
                        {item?.changed_by?.last_name}
                      </Text>
                    </TableCell>
                  </MediaQuery>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Text>{item?.changed_on_delta_humanized}</Text>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};
