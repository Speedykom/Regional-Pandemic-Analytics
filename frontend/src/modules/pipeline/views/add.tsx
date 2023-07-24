import { AppDrawer } from "@/common/components/AppDrawer";
import { ShowMessage } from "@/common/components/ShowMessage";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useCreatePipelineMutation } from "../pipeline";

interface AddPipelineProps {
  state: boolean;
  onClose: () => void;
  template: any;
}

export const AddPipeline = ({ state, onClose, template }: AddPipelineProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addPipeline] = useCreatePipelineMutation();

  const onFinish = (value: any) => {
    setLoading(true);

    addPipeline({ ...value, path: template?.path })
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
      title={"Add Pipeline"}
      state={state}
      onClose={cancel}
      footer={footer}
    >
      <Form
        form={form}
        name="add-pipeline"
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="Name"
          tooltip="Pipeline Name"
          rules={[
            {
              required: true,
              message: "Please input your pipeline name",
            },
          ]}
        >
          <Input placeholder="Enter Name" className="w-full" />
        </Form.Item>
        <Form.Item name="path" label="Template" className="w-full">
          <Input
            disabled
            placeholder={template?.name}
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          tooltip="Pipeline Description"
          rules={[
            {
              required: true,
              message: "Please enter your description",
            },
          ]}
        >
          <Input.TextArea
            className="w-full"
            placeholder="Enter Description"
          />
        </Form.Item>
      </Form>
    </AppDrawer>
  );
};
