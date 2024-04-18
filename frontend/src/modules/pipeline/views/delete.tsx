import {
  useGetProcessByTaskIdQuery,
  useToggleProcessStatusMutation,
} from '@/modules/process/process';
import { toast } from 'react-toastify';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableHeaderCell,
  TableRow,
  TextInput,
} from '@tremor/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@/common/components/Loader';
import { DagDetails } from '@/modules/process/interface';
import { useDeletePipelineMutation } from '../pipeline';

type DeletePipelineProps = {
  hideModal: () => void;
  taskId: any;
};

export const DeletePipeline = ({ hideModal, taskId }: DeletePipelineProps) => {
  const { t } = useTranslation();

  const { data, isLoading, isSuccess } = useGetProcessByTaskIdQuery(taskId);
  const [deleteTask] = useDeletePipelineMutation();
  const [disableProcess] = useToggleProcessStatusMutation();
  const [confirmationText, setConfirmationText] = useState('');

  const renderProcessChainData = (processChainList: DagDetails[]) => {
    if (!!processChainList) {
      return processChainList.map((process) => {
        return (
          <TableRow key={process.dag_id}>
            <TableCell className="font-sans">{process.name}</TableCell>
            <TableCell className="whitespace-normal">
              {process.schedule_interval}
            </TableCell>
            {process.status ? (
              <TableCell className="font-sans">
                {t('deletePipeline.inactive')}
              </TableCell>
            ) : (
              <TableCell className="font-sans">
                {t('deletePipeline.active')}
              </TableCell>
            )}
          </TableRow>
        );
      });
    }
  };

  const handleOk = (processChainList: DagDetails[]) => {
    // diasble all related process chains
    if (!!processChainList) {
      const disablePromises: any[] = [];
      for (const process of processChainList) {
        disablePromises.push(
          disableProcess(process.dag_id).then((res: any) => {
            if (res.error) {
              toast.error(
                `${t('deletePipeline.disableProcessErrorMessage')} ${
                  process.name
                }`,
                {
                  position: 'top-right',
                }
              );
              return true;
            }
            return false;
          })
        );
      }
      Promise.all(disablePromises).then((results) => {
        const isErrorOccurred = results.some((result) => result);
        if (isErrorOccurred) {
          hideModal();
          return;
        }
      });
    }
    //delete pipeline
    deleteTask(taskId).then((res: any) => {
      if (res.error) {
        toast.error(`${t('deletePipeline.deletionErrorMessage')}`, {
          position: 'top-right',
        });
      } else {
        toast.success(`${t('deletePipeline.successMessage')}`, {
          position: 'top-right',
        });
      }
      hideModal();
    });
  };

  const handleCancel = () => {
    hideModal();
  };

  return (
    <div className="border-t h-90 w-full">
      <p className="bg-yellow-200 px-3 py-2 rounded-md mt-3 text-gray-500">
        {t('deletePipeline.warningMessage')}
      </p>
      <div className="mt-5">
        {isLoading && (
          <div className="flex h-96 bg-white shadow-md border rounded-md items-center justify-center">
            <div className="w-16 h-16">
              <Loader />
            </div>
          </div>
        )}
      </div>
      {isSuccess && (
        <div>
          <Card className="bg-white">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>
                    {t('deletePipeline.processName')}
                  </TableHeaderCell>
                  <TableHeaderCell>
                    {t('deletePipeline.processScheduleIntervalLabel')}
                  </TableHeaderCell>
                  <TableHeaderCell>
                    {t('deletePipeline.processStatus')}
                  </TableHeaderCell>
                  <TableHeaderCell />
                </TableRow>
              </TableHead>
              <TableBody>{renderProcessChainData(data?.dags)}</TableBody>
            </Table>
          </Card>
        </div>
      )}
      <div>
        <p className="mt-12 text-gray-500">
          {t('deletePipeline.confirmationMessage')}
        </p>
        <TextInput
          placeholder={t('deletePipeline.confirmationPlaceholder')}
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="mt-4"
        />
      </div>
      <div className="mt-8 flex justify-end space-x-2">
        <Button
          type="button"
          className=" bg-blue-100 px-4 py-2 text-sm text-blue-900 hover:bg-blue-200 border-0"
          onClick={handleCancel}
        >
          {t('deletePipeline.cancelButton')}
        </Button>
        <Button
          onClick={() => data && data.dags && handleOk(data?.dags)}
          className="bg-prim hover:bg-prim-hover text-white border-0 text-sm"
          disabled={confirmationText !== 'DELETE'}
        >
          {t('deletePipeline.deleteButton')}
        </Button>
      </div>
    </div>
  );
};
