import {
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
  Divider,
} from '@tremor/react';
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
  const lastParsedTimeDate = new Date(lastParsedTime);
  const nextDagRunDate = new Date(nextDagRun);

  const isValidDate = (date: Date) => {
    return date.getTime() !== new Date(0).getTime();
  };

  return (
    <div className="flex flex-col space-y-3 ">
      <div className="flex justify-center">
        <Table className="flex justify-center overflow-visible w-1/2">
          <TableRow>
            <TableHeaderCell>description</TableHeaderCell>
            <TableCell className="whitespace-normal">{description}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeaderCell>Last update</TableHeaderCell>
            <TableCell className="whitespace-normal">
              {lastParsedTimeDate.toUTCString()}
            </TableCell>
          </TableRow>
          {isValidDate(nextDagRunDate) && (
            <TableRow>
              <TableHeaderCell>Next scheduled execution</TableHeaderCell>
              <TableCell className="whitespace-normal">
                {nextDagRunDate.toUTCString()}
              </TableCell>
            </TableRow>
          )}
        </Table>
      </div>
      <div className="">
        <Divider />
      </div>
      <div>
        <History dagId={dagId} />
      </div>
    </div>
  );
}
