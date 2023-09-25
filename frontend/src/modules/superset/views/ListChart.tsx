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

export const ChartList = () => {
  const { data } = useGetChartsQuery();
  const { t } = useTranslation();
  return (
    <div className="">
      <nav className="mb-5">
        <div>
          <h2 className="text-3xl">{t('supersetCharts')}</h2>
          <p className="mt-2 text-gray-600">
            {t('chartListCreatedOnSuperset')}{' '}
          </p>
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
              {(data?.result || []).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Text className="font-sans">{item.slice_name}</Text>
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
                  <MediaQuery minWidth={1624}>
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
