import {
  Card,
  Text,
  Badge,
  Table,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { useTranslation } from 'react-i18next';
import {
  CheckIcon,
  SignalSlashIcon,
  WifiIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import MediaQuery from 'react-responsive';
import { FiXCircle, FiEye, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Popconfirm from '@/common/components/common/popconfirm';
import {
  useDisableUserMutation,
  useEnableUserMutation,
  useGetUsersQuery,
} from '../user';

export const UserList = () => {
  const { data, refetch } = useGetUsersQuery();
  const [disableUser, { isLoading }] = useDisableUserMutation();
  const [enableUser, { isLoading: isEnabling }] = useEnableUserMutation();
  const router = useRouter();
  const { t } = useTranslation();

  const onDelete = (id: string) => {
    disableUser(id).then((res: any) => {
      if (res.error) {
        toast.error(res?.response?.data?.message, {
          position: 'top-right',
        });
      } else {
        toast.success(res?.data?.message, {
          position: 'top-right',
        });
        refetch();
      }
    });
  };

  const onEnable = (id: string) => {
    enableUser(id).then((res: any) => {
      if (res.error) {
        toast.error(res?.response?.data?.message, {
          position: 'top-right',
        });
      } else {
        toast.success(res?.data?.message, {
          position: 'top-right',
        });
        refetch();
      }
    });
  };

  return (
    <div className="">
      <nav className="mb-5 flex justify-between items-center">
        <div>
          <h2 className="text-3xl">{t('appAccounts')}</h2>
          <p className="my-2 text-gray-600">{t('viewAndManage')}</p>
        </div>
        <Button
          className="bg-prim hover:bg-prim-hover text-white border-0"
          onClick={() => router.push('/users/add')}
        >
          {t('newUser')}
        </Button>
      </nav>
      <div>
        <Card className="bg-white">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{t('fullName')}</TableHeaderCell>
                <MediaQuery minWidth={768}>
                  <TableHeaderCell className="">
                    {t('username')}
                  </TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1090}>
                  <TableHeaderCell className="">{t('email')}</TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1220}>
                  <TableHeaderCell className="">{t('phone')}</TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1350}>
                  <TableHeaderCell className="">{t('gender')}</TableHeaderCell>
                  <TableHeaderCell className="">{t('country')}</TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1624}>
                  <TableHeaderCell className="">
                    {' '}
                    {t('emailVerified')}
                  </TableHeaderCell>
                  <TableHeaderCell className="">{t('status')}</TableHeaderCell>
                </MediaQuery>
                <TableHeaderCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {(data || []).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center pr-1">
                      <Text className="font-sans">
                        {item.firstName} {item?.lastName}
                      </Text>
                    </div>
                  </TableCell>
                  <MediaQuery minWidth={768}>
                    <TableCell className="">
                      <Text>{item.username}</Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1090}>
                    <TableCell className="">
                      <Text>{item.email}</Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1220}>
                    <TableCell className="">
                      <Text>
                        {item.attributes?.phone
                          ? item.attributes?.phone[0]
                          : ''}
                      </Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1350}>
                    <TableCell className="">
                      <Text>
                        {item.attributes?.gender
                          ? item.attributes?.gender[0]
                          : 'None'}
                      </Text>
                    </TableCell>
                    <TableCell className="">
                      <Text>
                        {item.attributes?.country
                          ? item.attributes?.country[0]
                          : 'None'}
                      </Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1624}>
                    <TableCell className="">
                      {item.emailVerified ? (
                        <Badge
                          className="flex items-center space-x-1"
                          icon={CheckIcon}
                          color="indigo"
                        >
                          {t('verified')}
                        </Badge>
                      ) : (
                        <Badge icon={XMarkIcon} color="red">
                          {t('unverified')}
                        </Badge>
                      )}{' '}
                    </TableCell>
                    <TableCell className="">
                      {item.enabled ? (
                        <Badge
                          className="flex items-center space-x-1"
                          color="green"
                          icon={WifiIcon}
                        >
                          {t('active')}
                        </Badge>
                      ) : (
                        <Badge color="red" icon={SignalSlashIcon}>
                          {t('disabled')}
                        </Badge>
                      )}{' '}
                    </TableCell>
                  </MediaQuery>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Button
                        title={t('viewDetails')}
                        variant="primary"
                        onClick={() => router.push(`users/${item.id}/details`)}
                      >
                        <FiEye />
                      </Button>

                      <Popconfirm
                        title={t('Thisuserwillbedeniedaccess')}
                        cancelText={t('cancel')}
                        okText={t('confirm')}
                        onConfirm={() => onDelete(item.id)}
                      >
                        <Button
                          title={t('disableUser')}
                          loading={isLoading}
                          className="text-white bg-red-500 border-0"
                        >
                          <FiXCircle />
                        </Button>
                      </Popconfirm>
                      <Popconfirm
                        title={t('Thisuserwillbeenabled')}
                        cancelText={t('cancel')}
                        okText={t('confirm')}
                        onConfirm={() => onEnable(item.id)}
                      >
                        <Button
                          title={t('enableUser')}
                          loading={isEnabling}
                          className="text-white bg-green-500 border-0"
                        >
                          <FiCheckCircle />
                        </Button>
                      </Popconfirm>
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
