import React from 'react';
import { ProcessChainChartList } from '@/modules/superset/views/ListChart';
import CreateChartButton from './ChartsElements/CreateChartButton';

interface ChartsProps {
  dagId: string;
  createChartUrl: string | null;
}

export default function Charts({ createChartUrl, dagId }: ChartsProps) {
  return (
    <div className="flex flex-col">
      <div>
        <ProcessChainChartList dagId={dagId} />
      </div>
      <div className="flex justify-end mt-6">
        <CreateChartButton dagId={dagId} createChartUrl={createChartUrl} />
      </div>
    </div>
  );
}
