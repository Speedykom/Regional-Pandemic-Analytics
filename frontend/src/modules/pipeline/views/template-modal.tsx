import Tooltip from '@/common/components/common/Tooltip';
import { Button, Card, Title } from '@tremor/react';
import { useState } from 'react';
import { useGetAllTemplatesQuery } from '../pipeline';
import { Template } from '../interface';
import { useTranslation } from 'react-i18next';

type TemplateModalProps = {
  onSelect: (value: any) => void;
  hideModal: () => void;
};

export const TemplateModal = ({ onSelect, hideModal }: TemplateModalProps) => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<Template>();
  const [searchQuery, setSearchQuery] = useState<string>(''); // Step 1
  const { data: templates } = useGetAllTemplatesQuery(searchQuery);

  const getIcon = (name: string) => {
    const icons = [
      'dhis2',
      'csv',
      'excel',
      'fhir',
      'json',
      'api',
      'postgresql',
      'sheet',
      'sormas',
      'blank',
    ];

    const checkIcon = icons.find((e) => name.toLowerCase().indexOf(e) != -1);

    const icon = checkIcon;

    switch (icon) {
      case 'dhis2':
        return './images/dhis2.png';
      case 'csv':
        return './images/csv.png';
      case 'excel':
        return './images/excel.png';
      case 'fhir':
        return './images/fhir.webp';
      case 'json':
        return './images/json.png';
      case 'api':
        return './images/api.png';
      case 'postgresql':
        return './images/postgresql.png';
      case 'sheet':
        return './images/sheet.png';
      case 'sormas':
        return './images/sormas.jpg';
      case 'blank':
        return './images/blank.png';
      default:
        return './images/custom.png'; // Return custom icon if no match is found
    }
  };

  const handleOk = () => {
    if (selected != undefined) {
      onSelect(selected);
      setSelected(undefined);
      hideModal();
    }
  };

  const handleCancel = () => {
    onSelect(false);
    setSelected(undefined);
    hideModal();
  };

  return (
    <div className="border-t h-90 w-full">
      <p className="bg-yellow-200 px-3 py-2 rounded-md mt-3 text-gray-500">
        {t('addPipelineNote')}
      </p>
      <input
        type="text"
        placeholder={t('searchForTemplate')}
        className="w-full border border-gray-300 rounded-md p-2 mt-3"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-3 h-80 overflow-auto">
        {(templates?.data || []).map((template, index) => (
          <div key={index} className="">
            <Tooltip position="top" fontSize="16px">
              <Card
                key={index}
                title={template?.name}
                onClick={() => setSelected(template)}
                className={`border-2 ${
                  selected?.name === template?.name
                    ? `border-green-800`
                    : `border-gray-300 hover:border-green-800`
                } cursor-pointer`}
              >
                <div className="">
                  <Title className="w-full border-b text-sm font-normal text-prim whitespace-nowrap overflow-hidden text-ellipsis">
                    {template?.name}
                  </Title>
                </div>
                <div className="flex justify-center p-3">
                  <img
                    className="h-16"
                    src={getIcon(template?.name)}
                    alt="icon"
                  />
                </div>
              </Card>
            </Tooltip>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end space-x-2">
        <Button
          type="button"
          className=" bg-blue-100 px-4 py-2 text-sm text-blue-900 hover:bg-blue-200 border-0"
          onClick={handleCancel}
        >
          {t('cancel')}
        </Button>
        <Button
          disabled={selected == undefined}
          onClick={handleOk}
          className="bg-prim hover:bg-prim-hover text-white border-0 text-sm"
        >
          {t('continue')}
        </Button>
      </div>
    </div>
  );
};
