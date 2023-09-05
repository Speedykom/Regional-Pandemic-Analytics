import Drawer from '@/common/components/common/Drawer';
import { schedule_intervals } from '@/common/utils/processs';
import {
  Button,
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
  const { register, handleSubmit, control } = useForm();

  const [createProcess] = useCreateProcessMutation();

  const footer = (
    <div className="space-x-2 p-2">
      <Button
        className="bg-prim text-white border-0 hover:bg-prim-hover"
        onClick={handleSubmit((values) => {
          createProcess({
            name: values.processName,
            pipeline: values.pipelineTemplate,
            schedule_interval: values.scheduleInterval,
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
        })}
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
        <form className="flex flex-col space-y-3">
          <div>
            <label>Process Chain</label>
            <TextInput
              {...register('processName', { required: true })}
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
        </form>
      </div>
    </Drawer>
  );
};
