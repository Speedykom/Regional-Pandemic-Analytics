import { useGetProcessHistoryTasksbyIdQuery } from '@/modules/process/process';
import { Button, Card } from '@tremor/react';
import { BiLoaderAlt, BiCheck } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { DagRunTask } from '@/modules/process/interface';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
interface ExecutionGraphProps {
  dagId: string;
  dagRunId: string;
}

function Graph({ dagId, dagRunId }: ExecutionGraphProps) {
  const { data, isSuccess } = useGetProcessHistoryTasksbyIdQuery({
    dag_id: dagId,
    dag_run_id: dagRunId,
  });

  if (isSuccess) {
    // data.tasks is an immutable array
    const tasks = data.tasks.slice();

    tasks.sort((a, b) => {
      const dateA = new Date(a.start_date);
      const dateB = new Date(b.start_date);
      return dateA.getTime() - dateB.getTime();
    });

    const tasksJSX = tasks.map((element: DagRunTask) => {
      return (
        <Button
          color={element.state === 'success' ? 'green' : 'blue'}
          key={element.task_id}
        >
          <div className="flex space-x-1">
            {element.state === 'success' ? (
              <BiCheck />
            ) : (
              <IconContext.Provider value={{ className: 'animate-spin' }}>
                <BiLoaderAlt />
              </IconContext.Provider>
            )}
            <span>{element.task_id}</span>
          </div>
        </Button>
      );
    });

    const insertArrows = (arr: JSX.Element[]) => {
      const legend = <ArrowLongRightIcon className="w-6" />;
      return arr.reduce((acc: JSX.Element[], val, ind, array) => {
        acc.push(val);
        if (ind < array.length - 1) {
          acc.push(legend);
        }
        return acc;
      }, []);
    };

    return (
      <div>
        <div className="flex space-x-2">{insertArrows(tasksJSX)}</div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default function ExecutionGraph({
  dagId,
  dagRunId,
}: ExecutionGraphProps) {
  return (
    <Card className="h-72">
      <div className="flex flex space-x-2">
        {dagRunId === '' ? (
          'Please select an execution'
        ) : (
          <Graph dagId={dagId} dagRunId={dagRunId} />
        )}
      </div>
    </Card>
  );
}
