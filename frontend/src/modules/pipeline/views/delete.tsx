import { useGetProcessByTaskIdQuery } from '@/modules/process/process';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@/common/components/Loader';
import { DagDetails } from '@/modules/process/interface';

type DeletePipelineProps = {
  hideModal: () => void;
  taskId: any;
};

export const DeletePipeline = ({ hideModal, taskId }: DeletePipelineProps) => {
  const { t } = useTranslation();

  const { data, isLoading, isSuccess } = useGetProcessByTaskIdQuery(taskId);

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
                {t('addProcess.inactive')}
              </TableCell>
            ) : (
              <TableCell className="font-sans">
                {t('addProcess.active')}
              </TableCell>
            )}
          </TableRow>
        );
      });
    }
  };

  const handleOk = () => {
    hideModal();
  };

  const handleCancel = () => {
    hideModal();
  };

  return (
    <div className="border-t h-90 w-full">
      <p className="bg-yellow-200 px-3 py-2 rounded-md mt-3 text-gray-500">
        Note: After deleting the pipeline, the following process chains will be
        disabled:
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
                  <TableHeaderCell>{t('addProcess.name')}</TableHeaderCell>
                  <TableHeaderCell>
                    {t('addProcess.scheduleIntervalLabel')}
                  </TableHeaderCell>
                  <TableHeaderCell>{t('addProcess.status')}</TableHeaderCell>
                  <TableHeaderCell />
                </TableRow>
              </TableHead>
              <TableBody>{renderProcessChainData(data?.dags)}</TableBody>
            </Table>
          </Card>
        </div>
      )}
      <div className="mt-8 flex justify-end space-x-2">
        <Button
          type="button"
          className=" bg-blue-100 px-4 py-2 text-sm text-blue-900 hover:bg-blue-200 border-0"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={handleOk}
          className="bg-prim hover:bg-prim-hover text-white border-0 text-sm"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
