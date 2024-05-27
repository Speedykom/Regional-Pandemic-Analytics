import { Title } from '@tremor/react';
import { useState } from 'react';
import ListExecution from './HistoryElements/ListExecution';
import ExecutionGraph from './HistoryElements/ExecutionGraph';
import { useTranslation } from 'react-i18next';

interface IHistroyProps {
  dagId: string;
}

export default function History({ dagId }: IHistroyProps) {
  const [selected, setSelected] = useState('');
  const { t } = useTranslation();

  return (
    <div>
      <Title> {t('orchestration.lastExecution')}</Title>
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
