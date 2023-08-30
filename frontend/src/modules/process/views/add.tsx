import { AppDrawer } from '@/common/components/AppDrawer';
import { ShowMessage } from '@/common/components/ShowMessage';
import { schedule_intervals } from '@/common/utils/processs';
import { Button, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DagForm } from '../interface';
import { PipelineList } from '@/modules/pipeline/interface';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { useCreateProcessMutation } from '../process';

interface IAddProcessProps {
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
}: IAddProcessProps) => {
  const { register, handleSubmit, control } = useForm();

  const [createProcess] = useCreateProcessMutation();

  const footer = (
    <div className="space-x-2 p-2">
      <Button
        className="bg-prim text-white border-0 hover:bg-prim-hover"
        onClick={handleSubmit(async (values) => {
          await createProcess({
            name: values.processName,
            pipeline: values.pipelineTemplate,
            schedule_interval: values.scheduleInterval,
          } as DagForm).then(() => {
            setTimeout(refetch, 1000);
            closePanel();
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
    <AppDrawer
      title="Add Process Chain"
      state={state}
      onClose={cancel}
      footer={footer}
    >
      <Form
        form={form}
        name="add-process"
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="Name"
          tooltip="Process Name"
          rules={[
            {
              required: true,
              message: 'Please enter process name',
            },
          ]}
        >
          <Input placeholder="Enter Dag Name" className="w-full" />
        </Form.Item>
        <Form.Item name="pipeline" label="Pipeline" className="w-full">
          <Select
            showSearch
            placeholder="Select Pipeline"
            options={pipelines.map((pipeline: any) => ({
              value: `${pipeline.name}.hpl`,
              label: pipeline.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="schedule_interval"
          label="Schedule Interval"
          rules={[
            {
              required: true,
              message: 'Please select schedule interval',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select Schedule Interval"
            options={schedule_intervals.map((time: string, i: number) => ({
              key: i,
              label: time,
              value: time,
            }))}
          />
        </Form.Item>
      </Form>
    </AppDrawer>
  );
};
