import { List, ListItem, Title } from '@tremor/react';
import { DagRun } from '../interface';

interface IHistroyProps {
  dagRuns: DagRun[];
}

export const History = ({ dagRuns }: IHistroyProps) => {
  return (
    <div>
      <Title>Last Execution</Title>
      <List>
        {dagRuns.map((dagRun: DagRun) => {
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
};
