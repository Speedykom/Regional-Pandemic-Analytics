import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from '@tremor/react';
import MediaQuery from 'react-responsive';
import { useGetChartsQuery } from '../superset';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const ChartList = () => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjusted to 5 items per page
  const { data } = useGetChartsQuery(searchInput);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = data?.result.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil((data?.result.length || 0) / itemsPerPage);

  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
        placeholder={t('searchForCharts')}
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
      <div className="flex justify-center gap-4 my-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => changePage(number)}
            className={`px-4 py-2 border-black-500 rounded ${
              currentPage === number
                ? 'bg-prim text-white'
                : 'bg-white text-black-500 border-black-500'
            } hover:bg-white-600 hover:text-black`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};
