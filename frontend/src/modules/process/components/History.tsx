import { List, ListItem, Title } from '@tremor/react';
import { DagRun } from '../interface';
import { useGetProcessHistoryByIdQuery } from '../process';

interface IHistroyProps {
  dagId: string;
}

export default function History({ dagId }: IHistroyProps) {
  const { data, isSuccess } = useGetProcessHistoryByIdQuery(dagId);
  return (
    <div>
      <Title>Last Execution</Title>
      <List>
        {isSuccess &&
          data.dag_runs.map((dagRun: DagRun) => {
            return (
              <ListItem key={dagRun.dag_run_id}>
                <span>{dagRun.dag_run_id}</span>
                <span>{dagRun.state}</span>
              </ListItem>
            );
          })}
      </List>
    </div>
  );
}
