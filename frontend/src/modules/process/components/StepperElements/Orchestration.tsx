import { Divider } from '@tremor/react';
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
    <div className="flex flex-col space-y-4 p-4 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <div className="text-l font-bold text-gray-800 text-center">
        Process Chain Summary
      </div>
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
              Description
            </td>
            <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
              {description}
            </td>
          </tr>
          <tr>
            <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
              Last update
            </td>
            <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
              {lastParsedTimeDate.toUTCString()}
            </td>
          </tr>
          {isValidDate(nextDagRunDate) && (
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                Next scheduled execution
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {nextDagRunDate.toUTCString()}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="">
        <Divider />
      </div>
      <div>
        <History dagId={dagId} />
      </div>
    </div>
  );
}
