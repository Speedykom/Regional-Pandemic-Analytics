import { useGetProcessHistoryTasksbyIdQuery } from '@/modules/process/process';
import { Button, Card } from '@tremor/react';
import { BiLoaderAlt, BiCheck } from 'react-icons/bi';
import { IconContext } from 'react-icons';
interface ExecutionGraphProps {
  dagId: string;
  dagRunId: string;
}

function graph(dagId: string, dagRunId: string) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isSuccess } = useGetProcessHistoryTasksbyIdQuery({
    dag_id: dagId,
    dag_run_id: dagRunId,
  });

  return (
    isSuccess &&
    data.tasks.map((element: any) => {
      return element.state === 'success' ? (
        <Button color="green" key={element.task_id}>
          <div className="flex space-x-1">
            <BiCheck />
            <span>{element.task_id}</span>
          </div>
        </Button>
      ) : (
        <Button key={element.task_id}>
          <div className="flex space-x-1">
            <IconContext.Provider value={{ className: 'animate-spin' }}>
              <BiLoaderAlt />
            </IconContext.Provider>
            <span>{element.task_id}</span>
          </div>
        </Button>
      );
    })
  );
}

export default function ExecutionGraph({
  dagId,
  dagRunId,
}: ExecutionGraphProps) {
  return (
    <Card className="h-72">
      <div className="flex flex space-x-2">
        {dagRunId === ''
          ? 'please select an execution'
          : graph(dagId, dagRunId)}
      </div>
    </Card>
  );
}
