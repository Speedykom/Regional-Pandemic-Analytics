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

export default function DataSourceSelection({ pipeline, pipelineList }: any) {
  const [newPipeline, setNewPipeline] = useState('');

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-center">
        <Table className="flex justify-center overflow-visible w-1/2">
          <TableRow className="">
            <TableHeaderCell>Pipeline used</TableHeaderCell>
            <TableCell>{pipeline}</TableCell>
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
                  {pipelineList.data.map((pipeline: any) => {
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
        <Button disabled={newPipeline === ''}>Save</Button>
      </div>
    </div>
  );
}
