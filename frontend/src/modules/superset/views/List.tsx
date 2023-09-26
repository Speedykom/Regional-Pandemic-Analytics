import { useRouter } from 'next/router';
import {
  Badge,
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
import MediaQuery from 'react-responsive';
import {
  CheckIcon,
  ExclamationCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useGetDashboardsQuery } from '../superset';
import { useState } from 'react';

export const DashboardList = () => {
  const { t } = useTranslation();

  const { data } = useGetDashboardsQuery();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState<string>('');

  // const filteredDashboards = data?.list_title
  //   .toLowerCase()
  //   .includes(searchInput.toLowerCase());
  const filteredDashboards = data?.result.filter((item) =>
    item.dashboard_title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const embedDashboard = (id: string) => {
    router.push(`/dashboards/${id}`);
  };
  return (
    <div className="">
      <nav className="mb-5">
        <div>
          <h2 className="text-3xl">{t('supersetDashboards')}</h2>
          <p className="mt-2 text-gray-600">
            {t('dashboardListCreatedOnSuperset')}
          </p>
        </div>
      </nav>
      <input
        type="text"
        placeholder="Search for dashboards..."
        className="w-full border border-gray-300 rounded-md p-2 mb-3"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div>
        <Card className="bg-white">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{t('title')}</TableHeaderCell>
                <MediaQuery minWidth={768}>
                  <TableHeaderCell className="">
                    {' '}
                    {t('createdBy')}
                  </TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1090}>
                  <TableHeaderCell className="">
                    {' '}
                    {t('created')}
                  </TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1220}>
                  <TableHeaderCell className="">
                    {' '}
                    {t('modifiedBy')}
                  </TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1350}>
                  <TableHeaderCell className="">
                    {' '}
                    {t('modified')}
                  </TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1624}>
                  <TableHeaderCell className=""> {t('status')}</TableHeaderCell>
                </MediaQuery>
                <TableHeaderCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDashboards?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Text className="font-sans">{item?.dashboard_title}</Text>
                  </TableCell>
                  <MediaQuery minWidth={768}>
                    <TableCell className="">
                      <Text>
                        {item?.created_by?.first_name}{' '}
                        {item?.created_by?.last_name}
                      </Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1090}>
                    <TableCell className="">
                      <Text>{item?.created_on_delta_humanized}</Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1220}>
                    <TableCell className="">
                      <Text>
                        {item?.changed_by?.first_name}{' '}
                        {item?.changed_by?.last_name}
                      </Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1350}>
                    <TableCell className="">
                      <Text> {item?.changed_on_delta_humanized}</Text>
                    </TableCell>
                    <TableCell className="">
                      {item.status == 'published' ? (
                        <Badge
                          className="flex items-center space-x-1"
                          icon={CheckIcon}
                          color="indigo"
                        >
                          {item.status}
                        </Badge>
                      ) : (
                        <Badge icon={ExclamationCircleIcon} color="red">
                          {item.status}
                        </Badge>
                      )}{' '}
                    </TableCell>
                  </MediaQuery>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Button
                        icon={EyeIcon}
                        title={t('viewDetails')}
                        variant="primary"
                        className="text-white shadow-md bg-prim hover:bg-prim-hover"
                        onClick={() => embedDashboard(String(item?.id))}
                      >
                        {t('preview')}
                      </Button>
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
