import React from 'react';
import Drawer from '@/common/components/common/Drawer';
import { schedule_intervals } from '@/common/utils/processs';
import {
  Button,
  DatePicker,
  SearchSelect,
  SearchSelectItem,
  TextInput,
} from '@tremor/react';
import { useForm, Controller } from 'react-hook-form';
import { useCreateProcessMutation } from '../process';
import { DagForm } from '../interface';
import { PipelineList } from '@/modules/pipeline/interface';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import punycode from 'punycode';

interface AddProcessProps {
  pipelineList: PipelineList;
  refetch: () => QueryActionCreatorResult<any>;
  panelState: boolean;
  closePanel: () => void;
}

export const AddProcess = ({
  pipelineList,
  refetch,
  panelState,
  closePanel,
}: AddProcessProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const { t } = useTranslation();

  const [createProcess] = useCreateProcessMutation();
  const permittedCharactersRegex = /^[^\s!@#$%^&*()+=[\]{}\\|;:'",<>/?]*$/;

  const footer = (
    <div className="space-x-2 p-2">
      <Button
        className="bg-prim text-white border-0 hover:bg-prim-hover"
        disabled={!!errors.processName}
        onClick={handleSubmit((values) => {
          if (!permittedCharactersRegex.test(values.processName)) {
            toast.error(t('addProcess.invalidProcessName'));
            return;
          }
          values.date.setHours(12, 0, 0);
          const encodedId = punycode.toASCII(values.processName);
          createProcess({
            name: values.processName,
            id: encodedId,
            pipeline: values.pipelineTemplate,
            // sending date without seconds because the backend is python3.9
            // and it can not handle seconds in isoString
            date: values.date.toISOString().split('T')[0],
            schedule_interval: values.scheduleInterval,
            description: values.description,
          } as DagForm)
            .unwrap()
            .then(() => {
              // WARNING !!!
              // The only reason why we're using setTimeout
              // is because Airflow takes time to rescan the dags directory
              // NEED TO BE CHANGED !!!
              setTimeout(refetch, 1000);
              toast.success(t('addProcess.successMessage'));
              closePanel();
            })
            .catch(() => {
              toast.error(t('addProcess.errorMessage'));
            });
        })}
      >
        {t('addProcess.submitButton')}{' '}
      </Button>
      <Button
        className="bg-blue-100 px-4 py-2 text-sm text-blue-900 hover:bg-blue-200 border-0"
        onClick={closePanel}
      >
        {t('addProcess.cancelButton')}
      </Button>
    </div>
  );

  return (
    <Drawer
      title={t('addProcess.title')}
      isOpen={panelState}
      onClose={closePanel}
      placement="right"
      width={350}
      footer={footer}
    >
      <div className="w-96 px-3">
        <div className="flex flex-col space-y-3">
          <div>
            <label>{t('addProcess.title')}</label>
            <TextInput
              {...register('processName', {
                required: true,
                pattern: {
                  value: permittedCharactersRegex,
                  message: t('addProcess.invalidProcessName'),
                },
              })}
              error={!!errors.processName}
              errorMessage={errors?.processName?.message?.toString()}
              type="text"
              className="w-full h-12"
              placeholder={t('addProcess.processChainLabel')}
            />
          </div>
          <div>
            <label>{t('addProcess.pipelineTemplateLabel')}</label>
            <Controller
              name="pipelineTemplate"
              control={control}
              defaultValue={''}
              render={({ field }) => {
                return (
                  <SearchSelect
                    {...field}
                    placeholder={t('addProcess.pipelineTemplateLabel')}
                  >
                    {pipelineList.data
                      .filter((pipeline) => pipeline.check_status === 'success')
                      .map((pipeline) => {
                        return (
                          <SearchSelectItem
                            key={pipeline.name}
                            value={pipeline.name}
                          >
                            {pipeline.name}
                          </SearchSelectItem>
                        );
                      })}
                  </SearchSelect>
                );
              }}
            />
          </div>

          <div>
            <label>
              <div>{t('addProcess.startDateLabel')}</div>
              <div className="p-1 pb-2">
                <p className="text-sm italic">{t('addProcess.note')}</p>
              </div>
            </label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { ...rest } = field;
                return (
                  <DatePicker
                    {...rest}
                    minDate={new Date()}
                    onValueChange={(v) => {
                      // the backend is using python 3.9 and it does not support iso string with milliseconds
                      setValue('date', v);
                    }}
                    placeholder={t('addProcess.selectDate')}
                  />
                );
              }}
            />
          </div>

          <div>
            <label>{t('addProcess.scheduleIntervalLabel')}</label>
            <Controller
              name="scheduleInterval"
              control={control}
              defaultValue={''}
              render={({ field }) => {
                return (
                  <SearchSelect
                    {...field}
                    placeholder={t('addProcess.scheduleIntervalPlaceholder')}
                  >
                    {schedule_intervals.map((interval) => {
                      const translatedInterval = t(
                        `schedule_intervals.${interval}`
                      );
                      return (
                        <SearchSelectItem key={interval} value={interval}>
                          {translatedInterval}
                        </SearchSelectItem>
                      );
                    })}
                  </SearchSelect>
                );
              }}
            />
          </div>

          <div>
            <label>{t('addProcess.descriptionLabel')}</label>
            <TextInput
              {...register('description', { required: true })}
              placeholder={t('addProcess.descriptionPlaceholder')}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};
