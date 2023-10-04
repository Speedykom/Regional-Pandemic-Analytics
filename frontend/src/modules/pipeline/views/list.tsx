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
import { useTranslation } from 'react-i18next';
import MediaQuery from 'react-responsive';
import { useState } from 'react';
import { usePermission } from '@/common/hooks/use-permission';
import { useModal } from '@/common/hooks/use-modal';
import { useRouter } from 'next/router';
import { useGetAllPipelinesQuery } from '../pipeline';
import { AddPipeline } from './add';
import { TemplateModal } from './template-modal';

export const MyPipelines = () => {
  const router = useRouter();

  const { hasPermission } = usePermission();
  const [template, setTemplate] = useState<any>();
  const [drawer, setDrawer] = useState<boolean>(false);
  const { t } = useTranslation();
  const close = () => {
    setDrawer(false);
    setTemplate(null);
  };

  const open = () => {
    setDrawer(true);
  };

  const onSelect = (res: any) => {
    if (res) open();
    setTemplate(res);
  };

  const { showModal, hideModal } = useModal();

  const [searchInput, setSearchInput] = useState<string>('');

  const { data, refetch } = useGetAllPipelinesQuery(searchInput);

  const showConfirmModal = () =>
    showModal({
      title: 'Hop Template',
      Component: () => (
        <div data-testid="delete-chart-modal">
          <div className="mb-6">
            <TemplateModal onSelect={onSelect} hideModal={hideModal} />
          </div>
        </div>
      ),
    });

  return (
    <div className="">
      <nav className="mb-5 flex justify-between items-center">
        <div>
          <h2 className="text-3xl">{t('myPipelines')}</h2>
          <p className="my-2 text-gray-600"> {t('createYourPipeline')}</p>
        </div>
        <div>
          {hasPermission('pipeline:add') && (
            <Button
              className="bg-prim hover:bg-prim-hover border-0"
              onClick={showConfirmModal}
            >
              {t('createPipeline')}
            </Button>
          )}
        </div>
      </nav>
      <input
        type="text"
        placeholder="Search for pipelines..."
        className="w-full border border-gray-300 rounded-md p-2 mb-3"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div>
        <Card className="bg-white">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{t('name')}</TableHeaderCell>
                <MediaQuery minWidth={1090}>
                  <TableHeaderCell className="">
                    {t('description')}
                  </TableHeaderCell>
                </MediaQuery>
                <TableHeaderCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-sans">{item?.name}</TableCell>
                  <MediaQuery minWidth={1090}>
                    <TableCell className="whitespace-normal">
                      {item?.description}
                    </TableCell>
                  </MediaQuery>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Button
                        onClick={() =>
                          router.push(
                            `/pipelines/${encodeURIComponent(item?.name)}`
                          )
                        }
                        className="hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
                      >
                        {t('view')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      <AddPipeline
        state={drawer}
        template={template}
        onClose={close}
        refetch={refetch}
      />
    </div>
  );
};
