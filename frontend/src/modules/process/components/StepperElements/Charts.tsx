import React from 'react';
import { ChartList } from '@/modules/superset/views/ListChart';
import CreateChartButton from './ChartsElements/CreateChartButton';

interface ChartsProps {
  dagId: string;
  createChartUrl: string | null;
}

export default function Charts({ createChartUrl, dagId }: ChartsProps) {
  return (
    <div className="flex flex-col">
      <div>
        <ChartList filterByDagId={dagId} hideCreateButton={true} />
      </div>
      <div className="flex justify-end mt-6">
        <CreateChartButton dagId={dagId} createChartUrl={createChartUrl} />
      </div>
    </div>
  );
}
