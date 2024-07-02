import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Icon,
} from '@tremor/react';
import { useTranslation } from 'react-i18next';
import MediaQuery from 'react-responsive';
import { useState, useEffect } from 'react';
import { usePermission } from '@/common/hooks/use-permission';
import { useModal } from '@/common/hooks/use-modal';
import { useRouter } from 'next/router';

import {
  useGetAllPipelinesQuery,
  useDownloadPipelineQuery,
  useUploadTemplateMutation,
} from '../pipeline';
import { AddPipeline } from './add';
import { DeletePipeline } from './delete';
import { UploadPipeline } from './upload';
import { TemplateModal } from './template-modal';
import {
  ArrowDownTrayIcon,
  TrashIcon,
  XCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { skipToken } from '@reduxjs/toolkit/query/react';

export const MyPipelines = () => {
  const router = useRouter();

  const { hasPermission } = usePermission();
  const [template, setTemplate] = useState<any>();
  const [drawer, setDrawer] = useState<boolean>(false);
  const [uploadDrawer, setUploadDrawer] = useState<boolean>(false);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const defaultPageSize = 5;

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

  const uploadClose = () => {
    setUploadDrawer(false);
  };
  const { showModal, hideModal } = useModal();

  const [searchInput, setSearchInput] = useState<string>('');

  const { data, refetch } = useGetAllPipelinesQuery(searchInput);

  const [savePipelineAsTemplate] = useUploadTemplateMutation();

  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const { data: downloadData, error: downloadError } = useDownloadPipelineQuery(
    selectedPipeline || skipToken,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (downloadData) {
      const blob = new Blob([downloadData], {
        type: 'application/octet-stream',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedPipeline}.hpl`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (downloadError) {
      toast.error(t('pipelineDownloadFailed'), { position: 'top-right' });
    }
  }, [downloadData, downloadError, selectedPipeline]);

  const showConfirmModal = () =>
    showModal({
      title: t('hopTemplate'),
      Component: () => (
        <div data-testid="delete-chart-modal">
          <div className="mb-6">
            <TemplateModal onSelect={onSelect} hideModal={hideModal} />
          </div>
        </div>
      ),
    });

  const showPipelineDeleteConfirmModal = (name: string) =>
    showModal({
      title: `${t('deletePipeline.title')} ${name}`,
      Component: () => (
        <div data-testid="delete-chart-modal">
          <div className="mb-6">
            <DeletePipeline hideModal={hideModal} taskId={name} />
          </div>
        </div>
      ),
    });

  const showUploadModal = () => {
    setUploadDrawer(true);
  };
  const renderPagination = () => {
    if (!defaultPageSize || !data?.data || data?.data?.length == 0) return null;

    const totalPages = Math.ceil(data.data.length / defaultPageSize);
    const startItem = (currentPage - 1) * defaultPageSize + 1;
    const endItem = Math.min(currentPage * defaultPageSize, data.data.length);

    return (
      <div className="flex justify-end items-center mt-4">
        <div className="mr-4">
          {t('showing')} {startItem} – {endItem} {t('of')} {data?.data?.length}
        </div>
        <div className="flex">
          <Button
            className="bg-prim hover:bg-green-900  border-0 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer mr-2"
            size="xs"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &larr; {t('prev')}
          </Button>
          <Button
            className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4  focus:outline-none cursor-pointer"
            size="xs"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {t('next')} &rarr;
          </Button>
        </div>
      </div>
    );
  };

  const renderTableData = () => {
    const startIndex = (currentPage - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    const visiblePipelines = defaultPageSize
      ? data?.data.slice(startIndex, endIndex)
      : data?.data;

    return visiblePipelines?.map((item, index) => {
      let statusIcon;
      if (item.check_status === 'success') {
        statusIcon = (
          <Icon
            size="lg"
            icon={CheckCircleIcon}
            color="green"
            tooltip={t(item.check_text)}
          />
        );
      } else if (item.check_status === 'failed') {
        statusIcon = (
          <Icon
            size="lg"
            icon={XCircleIcon}
            color="red"
            tooltip={t(item.check_text)}
          />
        );
      } else {
        statusIcon = (
          <Icon
            size="lg"
            icon={XCircleIcon}
            color="red"
            tooltip={t(item.check_text)}
          />
        );
      }
      return (
        <TableRow key={index}>
          <TableCell className="font-sans">{item?.name}</TableCell>
          <MediaQuery minWidth={1090}>
            <TableCell className="whitespace-normal">
              {item?.description}
            </TableCell>
          </MediaQuery>
          <TableCell>{statusIcon}</TableCell>
          <TableCell>
            <div className="flex space-x-2 justify-end">
              <Button
                onClick={() =>
                  router.push(`/pipelines/${encodeURIComponent(item?.name)}`)
                }
                className="hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
              >
                {t('view')}
              </Button>
              <Button
                onClick={() => saveAsTemplate(item?.name)}
                disabled={item?.check_status === 'failed'}
                className="hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
              >
                {t('savePipelineAsTemplate.saveButton')}
              </Button>
              <Icon
                onClick={() => downloadPipeline(item?.name)}
                size="lg"
                icon={ArrowDownTrayIcon}
                tooltip={t('download')}
                className="cursor-pointer"
                variant="shadow"
              />
              <Icon
                onClick={() => showPipelineDeleteConfirmModal(item?.name)}
                size="lg"
                icon={TrashIcon}
                tooltip={t('delete')}
                className="cursor-pointer"
                variant="shadow"
              />
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  const saveAsTemplate = (name: string) => {
    savePipelineAsTemplate(name).then((res: any) => {
      if (res.error) {
        toast.error(`${t('savePipelineAsTemplate.errorMessage')}`, {
          position: 'top-right',
        });
      } else {
        toast.success(`${t('savePipelineAsTemplate.successMessage')}`, {
          position: 'top-right',
        });
      }
    });
  };

  const downloadPipeline = (name: string) => {
    setSelectedPipeline(name);
  };
  return (
    <div className="">
      <nav className="mb-5 flex justify-between items-center">
        <div>
          <h2 className="text-3xl">{t('myPipelines')}</h2>
          <p className="my-2 text-gray-600"> {t('createYourPipeline')}</p>
        </div>
        <div className="flex">
          {hasPermission('pipeline:add') && (
            <Button
              className="bg-prim hover:bg-prim-hover border-0 mr-2"
              onClick={showConfirmModal}
            >
              {t('createPipeline')}
            </Button>
          )}
          {hasPermission('pipeline:add') && (
            <Button
              className="bg-prim hover:bg-prim-hover border-0"
              onClick={showUploadModal}
            >
              {t('uploadPipeline')}
            </Button>
          )}
        </div>
      </nav>
      <input
        type="text"
        placeholder={t('searchForPipelines')}
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
                <TableHeaderCell>{t('checkStatus')}</TableHeaderCell>
                <TableHeaderCell />
              </TableRow>
            </TableHead>
            <TableBody>{renderTableData()}</TableBody>
          </Table>
          {renderPagination()}
        </Card>
      </div>
      <AddPipeline
        state={drawer}
        template={template}
        onClose={close}
        refetch={refetch}
      />
      <UploadPipeline
        state={uploadDrawer}
        template={template}
        onClose={uploadClose}
        refetch={refetch}
      />
    </div>
  );
};
