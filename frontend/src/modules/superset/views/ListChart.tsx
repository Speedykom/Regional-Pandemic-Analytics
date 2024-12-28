import React, { useState } from 'react';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import Link from 'next/link';
import MediaQuery from 'react-responsive';
import { useGetChartsQuery } from '../superset';
import { useTranslation } from 'react-i18next';
import getConfig from 'next/config';

type ChartItem = {
  slice_url?: string;
  slice_name: string;
  viz_type: string;
  datasource_name_text: string;
  created_by: { first_name: string; last_name: string };
  created_on_delta_humanized: string;
  changed_by: { first_name: string; last_name: string };
  changed_on_delta_humanized: string;
};

interface ChartListProps {
  filterByDagId?: string;
}

const ChartList = ({ filterByDagId = '' }: ChartListProps) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState<string>('');
  const { data } = useGetChartsQuery(searchInput);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { publicRuntimeConfig } = getConfig();

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
  const totalPages = Math.ceil(
    (filteredCharts.result.length || 0) / itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const translateTimeDelta = (timeDelta: string): string => {
    const parts = timeDelta.split(' ');
    if (parts.length === 3) {
      const [value, unit] = parts;
      const singularUnit = unit.endsWith('s') ? unit.slice(0, -1) : unit;
      const key = `supersetcharts.${singularUnit}ago`;
      return t(key, { value });
    }
    return timeDelta;
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <nav className="mb-5">
          <h2 className="text-3xl">
            {filterByDagId ? t('processChainCharts') : t('supersetCharts')}
          </h2>
        </nav>
        <Button
          className="bg-prim hover:bg-prim-hover border-0 h-10"
          onClick={() => {
            window.open(
              `${publicRuntimeConfig.NEXT_PUBLIC_SUPERSET_URL}/chart/list`,
              '_blank'
            );
          }}
        >
          {t('createChartBtn')}
        </Button>
      </div>
      <input
        type="text"
        placeholder={t('searchForCharts')}
        className="w-full border border-gray-300 rounded-md p-2 mb-3"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {filteredCharts.result.length === 0 ? (
        <div className="text-center p-4">
          {filterByDagId
            ? t('noChartsForDagId', { dagId: filterByDagId })
            : t('noChartsAvailable')}
        </div>
      ) : (
        <>
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
                {currentItems.map((item: ChartItem, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link
                        style={{ textDecoration: 'underline' }}
                        href={`${process.env.NEXT_PUBLIC_SUPERSET_URL}${
                          item.slice_url || '#'
                        }`}
                        target="_blank"
                      >
                        {item.slice_name}
                      </Link>
                    </TableCell>

                    <MediaQuery minWidth={768}>
                      <TableCell>{item.viz_type}</TableCell>
                    </MediaQuery>
                    <MediaQuery minWidth={1090}>
                      <TableCell>{item.datasource_name_text}</TableCell>
                    </MediaQuery>
                    <MediaQuery minWidth={1220}>
                      <TableCell>
                        {item.created_by?.first_name}{' '}
                        {item.created_by?.last_name}
                      </TableCell>
                    </MediaQuery>
                    <MediaQuery minWidth={1350}>
                      <TableCell>
                        {translateTimeDelta(item.created_on_delta_humanized)}
                      </TableCell>
                      <TableCell>
                        {item.changed_by?.first_name}{' '}
                        {item.changed_by?.last_name}
                      </TableCell>
                    </MediaQuery>
                    <TableCell className="justify-end">
                      {translateTimeDelta(item.changed_on_delta_humanized)}
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
        </>
      )}
    </div>
  );
};

export { ChartList };
