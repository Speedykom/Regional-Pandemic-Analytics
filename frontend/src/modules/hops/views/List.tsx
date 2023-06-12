import { IGADTable } from "@/src/components/common/table";
import {
  DeleteColumnOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, message, Upload } from "antd";
import { useHops } from "../hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { getData } from "@/utils";
import { IRoles } from "../interface";
import { OpenNotification } from "@/utils/notify";
import { useRouter } from "next/router";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

interface props {
  viewPro: () => void;
}

enum OPERATION_TYPES {
  CREATE,
  UPDATE,
  NONE,
}

export const HopList = () => {
  const del = () => {};
  const [form] = Form.useForm();
  const router = useRouter();

  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchToken = async () => {
    try {
      const url = "/api/get-access-token/";
      const response = await getData(url);
      setToken(response?.accessToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [data, setData] = useState<Array<string>>([]);

  const [view, setView] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<string>();

  const fetchHops = async () => {
    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/`;
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          const templates: Array<any> = [];
          res?.data?.data?.map((data: any, index: number) => {
            const template = {
              id: index + 1,
              name: data?.name,
            };
            templates.push(template);
          });
          setData(templates);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const refetch = () => {
    fetchHops();
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const [open, setOpen] = useState(false);

  const edit = (id: string, name: string, description: string) => {
    setRoleId(id);
    setOpertaionType(OPERATION_TYPES.UPDATE);
    form.setFieldValue("name", name);
    form.setFieldValue("description", description);
    setOpen(true);
  };

  const showModal = () => {
    setOpertaionType(OPERATION_TYPES.CREATE);
    setOpen(true);
  };

  const [operationType, setOpertaionType] = useState<OPERATION_TYPES>(
    OPERATION_TYPES.NONE
  );

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchToken();
    fetchHops();
  }, []);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (formFieldValues: any) => {
    console.log(formFieldValues);
    const formData = new FormData();

    if (formFieldValues.filename != undefined) {
      formData.append("filename", formFieldValues.filename);
    } else {
      formData.append("filename", "");
    }

    fileList.forEach((file) => {
      formData.append("file", file as RcFile);
    });
    setUploading(true);
    await axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/new/`, formData, {
        headers: {
          Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`, // `Bearer ${token}`
        },
      })
      .then((res) => {
        setFileList([]);
        refetch();
        message.success(res?.data?.message);
        setOpen(false);
      })
      .catch((err) => {
        if (err?.response?.data?.detail) {
          message.error(err?.response?.data?.detail);
        } else {
          message.error(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  const { columns } = useHops({ edit, del, refetch });
  // @ts-ignore
  return (
    <div className="">
      <nav>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl">Hop Pipelines</h2>
            <p className="my-2 text-gray-600">
              Upload, View and manage pipeline templates.
            </p>
          </div>
          <div>
            <Button type="primary" size="large" onClick={showModal}>
              Upload Template
            </Button>
          </div>
        </div>
      </nav>
      <section className="mt-5">
        <div className="py-2">
          <IGADTable
            key={"id"}
            loading={loading}
            rows={data}
            columns={columns}
            onRow={(record: any, rowIndex: number) => {
              return {
                onClick: () => {
                  router.push(`/hops/${record?.name}`);
                },
              };
            }}
          />
        </div>
      </section>
      <Modal
        open={open}
        title={
          operationType == OPERATION_TYPES.CREATE
            ? "Create Template"
            : operationType == OPERATION_TYPES.UPDATE && "Update Template"
        }
        onCancel={handleCancel}
        footer={
          <Form form={form} onFinish={handleUpload}>
            <Form.Item>
              <div className="flex space-x-2 justify-center">
                <Button
                  className="focus:outline-none px-6 py-2 text-gray-700 font-medium flex items-center"
                  style={{
                    backgroundColor: "#48328526",
                    border: "1px solid #48328526",
                  }}
                  type="primary"
                  icon={<DeleteColumnOutlined />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  className="flex items-center"
                  icon={<SaveOutlined />}
                  style={{
                    backgroundColor: "#087757",
                    border: "1px solid #e65e01",
                  }}
                  htmlType="submit"
                >
                  {operationType == OPERATION_TYPES.CREATE
                    ? "Save Template"
                    : operationType == OPERATION_TYPES.UPDATE && "Save Changes"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        }
      >
        <Form
          {...formItemLayout}
          form={form}
          name="uploadFile"
          onFinish={handleUpload}
          scrollToFirstError
          size="large"
          className="w-full"
        >
          <Form.Item name="filename" label="File Name" className="w-full">
            <Input className="w-full" />
          </Form.Item>
          <Form.Item
            name="file"
            label="Select File"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Please select the file",
              },
            ]}
          >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
