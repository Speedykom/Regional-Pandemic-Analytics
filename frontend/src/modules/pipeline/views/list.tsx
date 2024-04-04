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
import { useState } from 'react';
import { usePermission } from '@/common/hooks/use-permission';
import { useModal } from '@/common/hooks/use-modal';
import { useRouter } from 'next/router';
import { useGetAllPipelinesQuery, useDownloadPipelineQuery } from '../pipeline';
import { AddPipeline } from './add';
import { DeletePipeline } from './delete';
import { UploadPipeline } from './upload';
import { TemplateModal } from './template-modal';
import { ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
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

  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const { data: downloadData } = useDownloadPipelineQuery(
    selectedPipeline || skipToken,
    {
      refetchOnMountOrArgChange: true,
    }
  );

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

  const showPipelineDeleteConfirmModal = (name: string) =>
    showModal({
      title: `Delete Pipeline: ${name}`,
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
          Showing {startItem} – {endItem} of {data?.data?.length}
        </div>
        <div className="flex">
          <Button
            className="bg-prim hover:bg-green-900  border-0 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer mr-2"
            size="xs"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &larr; Prev
          </Button>
          <Button
            className="bg-prim hover:bg-green-900 border-0 text-white font-bold py-2 px-4  focus:outline-none cursor-pointer"
            size="xs"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next &rarr;
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
      return (
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
                  router.push(`/pipelines/${encodeURIComponent(item?.name)}`)
                }
                className="hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
              >
                {t('view')}
              </Button>
              <Icon
                onClick={() => downloadPipeline(item?.name)}
                size="lg"
                icon={ArrowDownTrayIcon}
                tooltip="Download"
              />
              <Icon
                onClick={() => showPipelineDeleteConfirmModal(item?.name)}
                size="lg"
                icon={TrashIcon}
                tooltip="Delete"
              />
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  const downloadPipeline = async (name: string) => {
    try {
      setSelectedPipeline(name);
      const blob = new Blob([downloadData], {
        type: 'text/xml',
      });
      const link = document.createElement('a');
      var url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `${name}.hpl`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Release the URL object to free resources
      URL.revokeObjectURL(url);
    } catch (error) {
      // Handle any errors that may occur during the download
      toast.error('Failed to download pipeline', { position: 'top-right' });
    }
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
