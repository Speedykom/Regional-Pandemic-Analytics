import { AppDrawer } from "@/common/components/AppDrawer";
import { ShowMessage } from "@/common/components/ShowMessage";
import { schedule_intervals } from "@/common/utils/processs";
import { useFindAllQuery as usePipelinesQuery } from "@/modules/pipeline/pipeline";
import { useCreateProcessChainMutation } from "@/modules/process/process";
import { Button, Form, Input, Select } from "antd";
import { useState } from "react";

interface Props {
  state: boolean;
  onClose: () => void;
}

export const AddProcess = ({ state, onClose }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addProcess] = useCreateProcessChainMutation();

  const { data: res } = usePipelinesQuery();

  const pipelines = res?.data || [];

  const onFinish = (value: any) => {
    setLoading(true);

    addProcess({ ...value })
      .then((res: any) => {
        if (res.error) {
          const { data } = res.error;
          const { message } = data;

          ShowMessage("error", message);
          return;
        }

        ShowMessage("success", "Process created successfully");
        cancel();
      })
      .finally(() => setLoading(false));
  };

  const cancel = () => {
    form.resetFields();
    onClose();
  };

  const footer = (
    <div className="space-x-2 p-2">
      <Button loading={loading} type="primary" onClick={() => form.submit()}>
        Submit
      </Button>
      <Button onClick={cancel} type="default">
        Cancel
      </Button>
    </div>
  );

  return (
    <AppDrawer
      title={"Add Process Chain"}
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
              message: "Please enter process name",
            },
          ]}
        >
          <Input placeholder="Enter Dag Name" className="w-full" />
        </Form.Item>
        <Form.Item name="pipeline" label="Pipeline" className="w-full">
          <Select
            showSearch
            placeholder="Select Pipeline"
            options={pipelines.map((pipeline: any, i: number) => ({
              key: i + 353,
              label: pipeline.name,
              value: pipeline.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="schedule_interval"
          label="Schedule Interval"
          rules={[
            {
              required: true,
              message: "Please select schedule interval",
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
