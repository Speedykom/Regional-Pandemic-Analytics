import { Title, Card } from '@tremor/react';
import { useState } from 'react';
import ListExecution from './HistoryElements/ListExecution';

interface IHistroyProps {
  dagId: string;
}

export default function History({ dagId }: IHistroyProps) {
  const [selected, setSelected] = useState('');

  return (
    <div>
      <Title>Last Execution</Title>
      <div className="flex space-x-4">
        <div>
          <ListExecution
            dagId={dagId}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
        <div className="grow">
          <Card className="h-72"></Card>
        </div>
      </div>
    </div>
  );
}
