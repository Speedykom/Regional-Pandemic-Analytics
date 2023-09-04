import { Table, TableCell, TableHeaderCell, TableRow } from '@tremor/react';
import History from './History';

interface OrchestrationProps {
  dagId: string;
  description: string;
  lastParsedTime: string;
  nextDagRun: string;
}

export default function Orchestration({
  dagId,
  description,
  lastParsedTime,
  nextDagRun,
}: OrchestrationProps) {
  return (
    <div className="flex space-y-3">
      <Table className="flex justify-center overflow-visible w-1/2">
        <TableRow>
          <TableHeaderCell>description</TableHeaderCell>
          <TableCell className="whitespace-normal">
            {description} hello there this is a basic description element that
            should be working. By the way, have fun in the demo. There is no
            description field in the Add component so please remember to add it
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHeaderCell>Last update</TableHeaderCell>
          <TableCell className="whitespace-normal">{lastParsedTime}</TableCell>
        </TableRow>
        <TableRow>
          <TableHeaderCell>Next scheduled execution</TableHeaderCell>
          <TableCell className="whitespace-normal">{nextDagRun}</TableCell>
        </TableRow>
      </Table>
      <div className="grow">
        <History dagId={dagId} />
      </div>
    </div>
  );
}
