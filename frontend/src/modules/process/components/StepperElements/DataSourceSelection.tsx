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

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-center">
        <Table className="flex justify-center overflow-visible w-1/2">
          <TableRow className="">
            <TableHeaderCell>Pipeline used</TableHeaderCell>
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
                  placeholder="Pipeline Template"
                >
                  {pipelineList.data.map((pipeline) => {
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
            });
            setTimeout(() => {
              refetch();
              setNewPipeline('');
            }, 3000);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
