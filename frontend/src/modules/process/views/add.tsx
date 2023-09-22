import Drawer from '@/common/components/common/Drawer';
import { schedule_intervals } from '@/common/utils/processs';
import {
  Button,
  DatePicker,
  SearchSelect,
  SearchSelectItem,
  TextInput,
} from '@tremor/react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { useCreateProcessMutation } from '../process';
import { DagForm } from '../interface';
import { PipelineList } from '@/modules/pipeline/interface';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { toast } from 'react-toastify';
import { useGetProcessQuery } from '../process';
import { DagDetails } from '../interface';

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
  const { register, handleSubmit, control, setValue } = useForm();
  const [createProcess] = useCreateProcessMutation();
  const { data } = useGetProcessQuery();

  const isNameValid = (inputname: string) => {
    if (data) {
      const processNames = data.dags.map((process: DagDetails) => process.name);
      return !processNames.includes(inputname);
    }
    return true;
  };

  const createNewProcess = (values: FieldValues) => {
    values.date.setHours(12, 0, 0);
    if (isNameValid(values.processName)) {
      createProcess({
        name: values.processName,
        pipeline: values.pipelineTemplate,
        // sending date without seconds because the backend is python3.9
        // and it can not handle seconds in isoString
        date: values.date.toISOString().split('T')[0],
        schedule_interval: values.scheduleInterval,
        description: values.description,
      } as DagForm)
        .then(() => {
          // WARNING !!!
          // The only reason why we're using setTimeout
          // is because Airflow takes time to rescan the dags directory
          // NEED TO BE CHANGED !!!
          setTimeout(refetch, 1000);
          toast.success('A new Process Chain is created !');
          closePanel();
        })
        .catch(() => {
          toast.error('An error has occured');
        });
    } else {
      toast.error('Process chain name already exists');
    }
  };

  const footer = (
    <div className="space-x-2 p-2">
      <Button
        className="bg-prim text-white border-0 hover:bg-prim-hover"
        onClick={handleSubmit((values) => createNewProcess(values))}
      >
        Submit
      </Button>
      <Button
        className="bg-blue-100 px-4 py-2 text-sm text-blue-900 hover:bg-blue-200 border-0"
        onClick={closePanel}
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <Drawer
      title={'Add Process Chain'}
      isOpen={panelState}
      onClose={closePanel}
      placement="right"
      width={350}
      footer={footer}
    >
      <div className="w-96 px-3">
        <div className="flex flex-col space-y-3">
          <div>
            <label>Process Chain</label>
            <TextInput
              {...register('processName', {
                required: true,
              })}
              placeholder="Process Chain"
            />
          </div>
          <div>
            <label>Pipeline Template</label>
            <Controller
              name="pipelineTemplate"
              control={control}
              defaultValue={''}
              render={({ field }) => {
                return (
                  <SearchSelect {...field} placeholder="Pipeline Template">
                    {pipelineList.data.map((pipeline) => {
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
            <label>Start Date</label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { value: _, ...rest } = field;
                return (
                  <DatePicker
                    {...rest}
                    onValueChange={(v) => {
                      // the backend is using python 3.9 and it does not support iso string with milliseconds
                      setValue('date', v);
                    }}
                    placeholder="Select Date"
                  />
                );
              }}
            />
          </div>
          <div>
            <label>Schedule Interval</label>
            <Controller
              name="scheduleInterval"
              control={control}
              defaultValue={''}
              render={({ field }) => {
                return (
                  <SearchSelect {...field} placeholder="Schedule Interval">
                    {schedule_intervals.map((interval) => {
                      return (
                        <SearchSelectItem key={interval} value={interval}>
                          {interval}
                        </SearchSelectItem>
                      );
                    })}
                  </SearchSelect>
                );
              }}
            />
          </div>
          <div>
            <label>Description</label>
            <TextInput
              {...register('description', { required: true })}
              placeholder="Description"
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};
