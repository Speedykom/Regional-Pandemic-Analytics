import { Title } from '@tremor/react';
import { useState } from 'react';
import ListExecution from './HistoryElements/ListExecution';
import ExecutionGraph from './HistoryElements/ExecutionGraph';

interface IHistroyProps {
  dagId: string;
}

export default function History({ dagId }: IHistroyProps) {
  const [selected, setSelected] = useState('');

  return (
    <div>
      <Title>Last Execution</Title>
      <div className="flex space-x-4 flex-end ">
        <div className="basis-1/4">
          <ListExecution
            dagId={dagId}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
        <div className="basis-3/4">
          <ExecutionGraph dagId={dagId} dagRunId={selected} />
        </div>
      </div>
    </div>
  );
}
