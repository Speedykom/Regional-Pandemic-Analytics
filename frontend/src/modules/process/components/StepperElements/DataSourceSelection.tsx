import {
  Button,
  SearchSelect,
  SearchSelectItem,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { useState } from 'react';
import { useUpdateProcessPipelineByIdMutation } from '../../process';
import { PipelineList } from '@/modules/pipeline/interface';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface DataSourceSelectionProps {
  dagId: string;
  pipeline: string;
  pipelineList: PipelineList;
  refetch: () => QueryActionCreatorResult<any>;
}

export default function DataSourceSelection({
  dagId,
  pipeline,
  pipelineList,
  refetch,
}: DataSourceSelectionProps) {
  const [newPipeline, setNewPipeline] = useState('');

  const [updateProcessPipelineById] = useUpdateProcessPipelineByIdMutation();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-center">
        <Table className="flex justify-center overflow-visible w-full">
          <TableRow className="">
            <TableHeaderCell>
              {t('dataSourceSelection.pipelineUsed')}
            </TableHeaderCell>
            <TableCell>{pipeline.slice(0, -4)}</TableCell>
          </TableRow>
          <TableRow className=" overflow-auto">
            <TableHeaderCell>Pipelines</TableHeaderCell>
            <TableCell className="pb-10">
              <div className="absolute">
                <SearchSelect
                  defaultValue=""
                  value={newPipeline}
                  onValueChange={setNewPipeline}
                  placeholder={t('dataSourceSelection.piplineTemplate')}
                >
                  {pipelineList.data
                    .filter((pipeline) => pipeline.check_status === 'success')
                    .map((pipeline) => {
                      return (
                        <SearchSelectItem
                          key={pipeline.name}
                          value={pipeline.name}
                        >
                          {pipeline.name}
                        </SearchSelectItem>
                      );
                    })}
                </SearchSelect>
              </div>
            </TableCell>
          </TableRow>
        </Table>
      </div>
      <div className="flex justify-center">
        <Button
          disabled={newPipeline === ''}
          onClick={() => {
            updateProcessPipelineById({
              old_pipeline: pipeline,
              new_pipeline: newPipeline + '.hpl',
              dag_id: dagId,
            })
              .then(() => {
                // WARNING !!!
                // The only reason why we're using setTimeout
                // is because Airflow takes time to rescan the dags directory
                // NEED TO BE CHANGED !!!
                setTimeout(() => {
                  refetch();
                  toast.success(t('pipelineUpdateSuccess'));
                  setNewPipeline('');
                }, 3000);
              })
              .catch(() => {
                toast.error(t('errorOccurred'));
              });
          }}
        >
          {t('dataSourceSelection.save')}
        </Button>
      </div>
    </div>
  );
}
