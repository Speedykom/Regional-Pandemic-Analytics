import { Button } from '@tremor/react';
import { FiPieChart } from 'react-icons/fi';
import { useGetDatasetInfoQuery } from '@/modules/process/process';
import { useState } from 'react';

interface createChartButtonProps {
  createChartUrl: string | null;
  dagId: string;
}

function openSupersetWithNewChart(datasetUrl: string) {
  window.open(datasetUrl, '_blank');
}

export default function CreateChartButton({
  createChartUrl,
  dagId,
}: createChartButtonProps) {
  const [state, setState] = useState({
    createChartUrl,
    hasDatasetUrl: !!createChartUrl,
  });

  const { data, isSuccess, isLoading } = useGetDatasetInfoQuery(dagId, {
    skip: state.hasDatasetUrl,
    pollingInterval: 5_000,
  });
  if (isSuccess && !isLoading && data.dataset?.url) {
    setState({
      ...state,
      createChartUrl: data.dataset.url,
      hasDatasetUrl: true,
    });
  }

  return (
    <Button
      variant="primary"
      icon={FiPieChart}
      disabled={!state.hasDatasetUrl}
      onClick={() => openSupersetWithNewChart(state.createChartUrl as string)}
    >
      Add a chart
    </Button>
  );
}
