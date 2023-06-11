import { AppDrawer } from "@/src/components/AppDrawer";
import { ShowMessage } from "@/src/components/ShowMessage";
import { useCreateProcessMutation } from "@/src/modules/process/process";
import { schedule_intervals } from "@/utils/processs";
import { Button, Form, Input, Select } from "antd";
import { useState } from "react";

interface Props {
  state: boolean;
  onClose: () => void;
}

export const AddProcess = ({ state, onClose }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addProcess] = useCreateProcessMutation();

  const onFinish = (value: any) => {
    setLoading(true);
    
    addProcess(value)
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
          name="dag_name"
          label="Dag name"
          tooltip="Dag name should be in this formate 'process-dag-name'"
          rules={[
            {
              required: true,
              message: "Please input your dag name",
            },
          ]}
        >
          <Input placeholder="Enter Dag Name" className="w-full" />
        </Form.Item>
        <Form.Item
          name="dag_id"
          label="Dag id"
          tooltip="Dag name should be in this formate 'process-dag-id'"
          rules={[
            {
              required: true,
              message: "Please input your dag id",
            },
          ]}
        >
          <Input placeholder="Enter Dag Id" className="w-full" />
        </Form.Item>
        <Form.Item
          name="path"
          label="Pipeline Path"
          className="w-full"
          rules={[
            {
              required: true,
              message: "Please input your Path to Process Chain",
            },
          ]}
        >
          <Input placeholder="Pipeline Path" className="w-full" />
        </Form.Item>
        <Form.Item
          name="parquet_path"
          label="Parquet path"
          rules={[
            {
              required: true,
              message: "Please input your parquet path",
            },
          ]}
        >
          <Input placeholder="Parquet path" className="w-full" />
        </Form.Item>
        <Form.Item
          name="schedule_interval"
          label="Schedule Interval"
          rules={[
            {
              required: true,
              message: "Please input your data source name",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Enter Schedule Interval"
            options={schedule_intervals.map((time: string, i: number) => ({
              key: i,
              label: time,
              value: time,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="data_source_name"
          label="Data source name"
          rules={[
            {
              required: true,
              message: "Please input your data source name",
            },
          ]}
        >
          <Input placeholder="Enter Data source name" className="w-full" />
        </Form.Item>
      </Form>
    </AppDrawer>
  );
};
