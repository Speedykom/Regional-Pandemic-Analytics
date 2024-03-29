import React from 'react';
import { useGetDatasourceInfoQuery } from '../../process';

interface DatasourceInfoProps {
  datasourceId: string;
}

const DatasourceInfo: React.FC<DatasourceInfoProps> = ({ datasourceId }) => {
  const { data, error, isLoading } = useGetDatasourceInfoQuery(datasourceId);
  //const { data, error, isLoading } = useGetDatasourceInfoQuery('test');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;

  return (
    <div>
      <h1>Datasource Information</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

interface AnalyticsDataModelProps {
  dataSourceName: string;
}

const AnalyticsDataModel: React.FC<AnalyticsDataModelProps> = ({
  dataSourceName,
}) => {
  const datasourceId = dataSourceName;

  return (
    <div>
      <h1>Analytics Data Model</h1>
      <DatasourceInfo datasourceId={datasourceId} />
    </div>
  );
};

export default AnalyticsDataModel;
