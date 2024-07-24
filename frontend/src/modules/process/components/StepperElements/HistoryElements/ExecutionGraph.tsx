import { useGetProcessHistoryTasksbyIdQuery } from '@/modules/process/process';
import { Button, Card } from '@tremor/react';
import { BiLoaderAlt, BiCheck, BiError } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { DagRunTask } from '@/modules/process/interface';
import { ArrowLongRightIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

interface ExecutionGraphProps {
  dagId: string;
  dagRunId: string;
}

interface GraphProps {
  tasks: DagRunTask[];
}

function Graph({ tasks }: GraphProps) {
  tasks.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateA.getTime() - dateB.getTime();
  });
  const tasksJSX = tasks.map((element: DagRunTask) => {
    let color: 'green' | 'blue' | 'red' = 'blue';
    let icon = (
      <IconContext.Provider value={{ className: 'animate-spin' }}>
        <BiLoaderAlt />
      </IconContext.Provider>
    );

    if (element.state === 'success') {
      color = 'green';
      icon = <BiCheck />;
    } else if (element.state === 'failed') {
      color = 'red';
      icon = <BiError />;
    }

    return (
      <Button color={color} key={element.task_id}>
        <div className="flex space-x-1">
          {icon}
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
      <div className="flex space-x-2 justify-center">
        {insertArrows(tasksJSX)}
      </div>
    </div>
  );
}

export default function ExecutionGraph({
  dagId,
  dagRunId,
}: ExecutionGraphProps) {
  const { data, isSuccess, refetch } = useGetProcessHistoryTasksbyIdQuery({
    dag_id: dagId,
    dag_run_id: dagRunId,
  });
  const { t } = useTranslation();

  return (
    <Card className="h-72">
      {dagRunId === '' ? (
        t('orchestration.selectExecution')
      ) : (
        <div className="flex flex-col h-full text-center">
          <div className="basis-1/4 flex flex-row-reverse">
            <div>
              <Button size="sm" onClick={refetch}>
                <ArrowPathIcon className="w-5" />
              </Button>
            </div>
          </div>
          <div className="basis-3/4 flex justify-center">
            <div>{isSuccess && <Graph tasks={data.tasks.slice()} />}</div>
          </div>
        </div>
      )}
    </Card>
  );
}
