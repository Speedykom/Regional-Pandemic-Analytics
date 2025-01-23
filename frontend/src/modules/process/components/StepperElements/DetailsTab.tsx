import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetDatasourceInfoQuery } from '../../process';

function DetailsTab({ dagId }: { dagId: string }) {
  const { t } = useTranslation();
  const { data: detailsTabData } = useGetDatasourceInfoQuery(dagId);

  const data = [
    { label: t('processChainDialog.modelName'), value: detailsTabData?.name },
    {
      label: t('processChainDialog.modelCreatedAt'),
      value: new Date(
        detailsTabData?.properties?.created ?? ''
      ).toLocaleString(),
    },
    {
      label: t('processChainDialog.modelSegmentCount'),
      value: detailsTabData?.segments_count,
    },
    {
      label: t('processChainDialog.modelDimensions'),
      value: detailsTabData?.last_segment?.dimensions?.join(', '),
    },
    {
      label: t('processChainDialog.modelTotalSize'),
      value: `${detailsTabData?.total_size} kb`,
    },
    {
      label: t('processChainDialog.modelLastUpdate'),
      value: new Date(
        detailsTabData?.last_segment?.version ?? ''
      ).toLocaleString(),
    },
    {
      label: 'Binary Version',
      value: detailsTabData?.last_segment?.binaryVersion,
    },
  ];

  return (
    <>
      <div className="text-[#4B4B4B] mt-3 mb-4 text-xl font-medium">
        {t('processChainDialog.dataModelInfo')}
      </div>
      <div className="flex flex-col gap-y-[1px]">
        {data.map((item, index) => (
          <div key={index} className="flex flex-row gap-x-[2px]">
            <div className="bg-[#00764B] w-[210px] h-11 flex items-center">
              <p className="text-white font-semibold px-3">{item.label}</p>
            </div>
            <div className="bg-[#F3F4F6] w-[600px] h-11 flex items-center">
              <p className="text-[#6B7280] px-3">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DetailsTab;
