import React from 'react';
import CreateChartButton from './ChartsElements/CreateChartButton';

interface ChartsProps {
  dagId: string;
  createChartUrl: string | null;
}

export default function Charts({ createChartUrl, dagId }: ChartsProps) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <CreateChartButton dagId={dagId} createChartUrl={createChartUrl} />
      </div>
    </div>
  );
}
