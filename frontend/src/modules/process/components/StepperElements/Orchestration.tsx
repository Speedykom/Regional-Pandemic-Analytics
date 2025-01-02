import { Divider } from '@tremor/react';
import History from './History';
import { useTranslation } from 'react-i18next';

interface OrchestrationProps {
  dagId: string;
  description: string;
  lastParsedTime: string;
  nextDagRun: string;
}

export default function Orchestration({
  dagId,
  description,
  lastParsedTime,
  nextDagRun,
}: OrchestrationProps) {
  const lastParsedTimeDate = new Date(lastParsedTime);
  const nextDagRunDate = new Date(nextDagRun);
  const { t } = useTranslation();
  const isValidDate = (date: Date) => {
    return date.getTime() !== new Date(0).getTime();
  };

  return (
    <div className="flex flex-col space-y-4 p-4 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <div className="text-l font-bold text-gray-800 text-center">
        {t('orchestration.processchainSummary')}
      </div>
      <div className="overflow-auto" style={{ maxHeight: '100px' }}>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                Description
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {description}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                {t('orchestration.lastUpdate')}
              </td>
              <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                {t(`days.${lastParsedTimeDate.getUTCDay()}`)},{' '}
                {lastParsedTimeDate.getUTCDate()}{' '}
                {t(`months.${lastParsedTimeDate.getUTCMonth()}`)}{' '}
                {lastParsedTimeDate.getUTCFullYear()}{' '}
                {lastParsedTimeDate.getUTCHours().toString().padStart(2, '0')}:
                {lastParsedTimeDate.getUTCMinutes().toString().padStart(2, '0')}
                :
                {lastParsedTimeDate.getUTCSeconds().toString().padStart(2, '0')}{' '}
                GMT
              </td>
            </tr>
            {isValidDate(nextDagRunDate) && (
              <tr>
                <td className="p-3 font-bold bg-prim text-white w-1/4 border border-gray-200">
                  {t('orchestration.nextScheduleExection')}
                </td>
                <td className="p-3 bg-gray-100 w-3/4 border border-gray-200">
                  {t(`days.${nextDagRunDate.getUTCDay()}`)},{' '}
                  {nextDagRunDate.getUTCDate()}{' '}
                  {t(`months.${nextDagRunDate.getUTCMonth()}`)}{' '}
                  {nextDagRunDate.getUTCFullYear()}{' '}
                  {nextDagRunDate.getUTCHours().toString().padStart(2, '0')}:
                  {nextDagRunDate.getUTCMinutes().toString().padStart(2, '0')}:
                  {nextDagRunDate.getUTCSeconds().toString().padStart(2, '0')}{' '}
                  GMT
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <Divider />
      </div>
      <div>
        <History dagId={dagId} />
      </div>
    </div>
  );
}
