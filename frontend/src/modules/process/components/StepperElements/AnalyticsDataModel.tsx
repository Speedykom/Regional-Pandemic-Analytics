import React from 'react';
import { useGetDatasourceInfoQuery } from '../../process';

interface DatasourceInfoProps {
  dataSourceName: string;
}

const DatasourceInfo: React.FC<DatasourceInfoProps> = ({ dataSourceName }) => {
  const { data, error, isLoading } = useGetDatasourceInfoQuery(dataSourceName);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;
  if (!data) return <div>No data available</div>;

  const datasourceData: any = data;

  return (
    <div className="flex flex-col space-y-4 p-4 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <div className="text-l font-bold text-gray-800 text-center">
        Datasource Information
      </div>
      <div className="overflow-auto" style={{ maxHeight: '300px' }}>
        <table className="w-full border-collapse">
          <tbody>
            {/* Name */}
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                Name
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {datasourceData.name}
              </td>
            </tr>
            {/* Created At */}
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                Created At
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {datasourceData.properties?.created}
              </td>
            </tr>
            {/* Number of Segments */}
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                Segment Count
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {datasourceData.segments_count}
              </td>
            </tr>
            {/* Dimensions */}
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                Dimensions
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {datasourceData.last_segment.dimensions.join(', ')}
              </td>
            </tr>
            {/* Size (Size * Number of Segments) */}
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                Total Size
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
