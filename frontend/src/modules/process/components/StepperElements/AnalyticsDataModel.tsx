import React from 'react';
import { useGetDatasourceInfoQuery } from '../../process';
import { useTranslation } from 'react-i18next';

interface DatasourceInfoProps {
  dataSourceName: string;
}

const DatasourceInfo: React.FC<DatasourceInfoProps> = ({ dataSourceName }) => {
  const { data, error, isLoading } = useGetDatasourceInfoQuery(dataSourceName);
  const { t } = useTranslation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;
  if (!data) return <div>No data available</div>;

  const datasourceData: any = data;
  const last_segment = datasourceData.last_segment || {};

  return (
    <div className="flex flex-col space-y-4 p-4 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <div className="text-l font-bold text-gray-800 text-center">
        {t('analyticsDataModel.dataSourceInfo')}
      </div>
      <div className="overflow-auto" style={{ maxHeight: '300px' }}>
        <table className="w-full border-collapse">
          <tbody>
            {/* Name */}
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                {t('analyticsDataModel.name')}
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {datasourceData.name}
              </td>
            </tr>
            {/* Created At */}
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                {t('analyticsDataModel.createdAt')}
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {datasourceData.properties?.created}
              </td>
            </tr>
            {/* Number of Segments */}
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                {t('analyticsDataModel.segmentCount')}
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {datasourceData.segments_count}
              </td>
            </tr>
            {/* Dimensions */}
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                {t('analyticsDataModel.dimensions')}
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {Array.isArray(last_segment.dimensions) &&
                last_segment.dimensions.length > 0
                  ? last_segment.dimensions.join(', ')
                  : t('analyticsDataModel.nodimensionsavailable')}
              </td>
            </tr>
            {/* Size (Size * Number of Segments) */}
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                {t('analyticsDataModel.totalSize')}
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {datasourceData.total_size} Kb
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasourceInfo;
