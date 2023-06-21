/* eslint-disable react-hooks/exhaustive-deps */
import { IGADTable } from "@/common/components/common/table";
import { DeleteColumnOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  SelectProps,
  Switch,
} from "antd";
import { useUsers } from "../hooks";
import { IUser } from "../interface";
import { useEffect, useState } from "react";
import { AddUser123 } from "./AddUser";
import axios from "axios";
import { PreviewUser } from "./Preview";
import { countries } from "@/common/utils/countries";
import { getData } from "@/common/utils";
import { OpenNotification } from "@/common/utils/notify";
import { api_url } from "@/common/utils/auth";
import Link from "next/link";

interface props {
  viewPro: () => void;
}

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const myCodeOptions: SelectProps["options"] = [];
const countryOptions: SelectProps["options"] = [];

countries.forEach((item, index) => {
  myCodeOptions.push({
    key: index,
    value: item.code,
    label: item.code,
  });
  countryOptions.push({
    key: index,
    value: item.name,
    label: item.name,
  });
});

export const UserList = () => {
  const [form] = Form.useForm();

  const [token, setToken] = useState<string>("");

  const fetchToken = async () => {
    try {
      const url = "/api/get-access-token/";
      const response = await getData(url);
      setToken(response?.accessToken);
      console.log(response?.accessToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<Array<IUser>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [code, setCode] = useState<string>("");
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState<string>("");
  const [roleLoading, setRoleLoading] = useState(true);

  const [view, setView] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const viewPro = (id: string) => {
    setView(true);
    setUserId(id);
  };
  const onCloseView = () => {
    setView(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/account/users`;
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setData(res?.data);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const refetch = () => {
    fetchToken();
    fetchUsers();
  };

  const [openModal, setOpenModal] = useState<boolean>(false);

  const edit = (
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    enabled: boolean,
    code: string,
    phone: string,
    country: string,
    gender: string,
    avatar: string
  ) => {
    setUserId(id);
    setOpenModal(true);
    form.setFieldValue("firstName", firstName);
    form.setFieldValue("lastName", lastName);
    form.setFieldValue("username", username);
    form.setFieldValue("email", email);
    form.setFieldValue("enabled", enabled);
    form.setFieldValue("code", code);
    form.setFieldValue("phone", phone);
    form.setFieldValue("country", country);
    form.setFieldValue("gender", gender);
    setCode(code);
  };

  const handleCancel = () => {
    setOpenModal(false);
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

  const onFinish = async (values: any) => {
    values["code"] = code;
    values["role"] = JSON.parse(values["role"]);
    await axios
      .put(`${api_url}/api/account/user/${userId}/update`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        OpenNotification(res?.data?.message, "topRight", "success");
        setOpenModal(false);
        refetch();
        form.resetFields();
      })
      .catch((err) => {
        OpenNotification(err.response?.data?.error, "topRight", "error");
      });
  };

  const selectBefore = (
    <Select
      size="large"
      value={code}
      onChange={setCode}
      showSearch
      placeholder={!code && "+232"}
      options={myCodeOptions}
    />
  );

  const fetchRoles = async () => {
    try {
      setRoleLoading(true);
      const url = `${api_url}/api/role`;
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRoleLoading(false);
          setRoles(res?.data);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [fetchRoles, fetchUsers]);

  const { columns } = useUsers({ edit, viewPro, refetch });
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl mb-2">Accounts</h2>
          <Breadcrumb
            items={[
              {
                title: <Link href="/home">Home</Link>,
              },
              {
                title: "Accounts",
              },
            ]}
          />
        </div>
        <div>
          <Button
            type="primary"
            size="large"
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            New User
          </Button>
        </div>
      </div>
      <section className="mt-5">
        <div className="py-2">
          <IGADTable
            key={"id"}
            loading={loading}
            rows={data}
            columns={columns}
          />
        </div>
      </section>
      <div>
        <AddUser123
          openDrawer={open}
          closeDrawer={onClose}
          refetch={fetchUsers}
        />
      </div>
      <div>
        {view && userId && (
          <PreviewUser
            openDrawer={view}
            closeDrawer={onCloseView}
            userId={userId}
          />
        )}
      </div>
      <Modal
        open={openModal}
        title={"Update Account"}
        onCancel={handleCancel}
        footer={
          <Form form={form} onFinish={onFinish}>
            <Form.Item>
              <div className="flex space-x-2 justify-end">
                <Button
                  className="focus:outline-none px-6 py-2 text-gray-700 font-medium flex items-center"
                  style={{
                    backgroundColor: "#48328526",
                    border: "1px solid #48328526",
                  }}
                  type="primary"
                  size="large"
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
                  size="large"
                >
                  Save Changes
                </Button>
              </div>
            </Form.Item>
          </Form>
        }
      >
        <div className="mt-8">
          <Form
            {...formItemLayout}
            form={form}
            onFinish={onFinish}
            scrollToFirstError
            size="large"
            className="w-full"
            labelAlign="left"
          >
            <Form.Item
              name="firstName"
              label="Given Names"
              className="w-full"
              rules={[
                {
                  required: true,
                  message: "Please input your given names",
                },
              ]}
            >
              <Input className="w-full" placeholder="John" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Family Name"
              rules={[
                {
                  required: true,
                  message: "Please input your family name",
                },
              ]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input className="w-full" placeholder="john.doe@mail.com" />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please input your username",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                {
                  required: true,
                  validator(rule, value, callback) {
                    if (value === "") {
                      callback("Please input your phone number");
                    } else if (!code) {
                      callback("Please select country code");
                    } else {
                      callback();
                    }
                  },
                },
              ]}
            >
              <Input
                type="number"
                addonBefore={selectBefore}
                placeholder="76293389"
              />
            </Form.Item>
            <Form.Item
              name="country"
              label="Country"
              rules={[
                {
                  required: true,
                  message: "Please select your country",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="select country"
                size="large"
                className="h-10 w-full mt-1 bg-gray-50"
                options={countryOptions}
              />
            </Form.Item>
            <Form.Item
              name={"gender"}
              label="Gender"
              rules={[
                {
                  required: true,
                  message: "Please select gender",
                },
              ]}
            >
              <Radio.Group
                options={genderOptions}
                className="h-10 mt-1 w-full"
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <Form.Item
              name="enabled"
              label="Enable"
              valuePropName="checked"
              tooltip="Toggle to enable or disable this user"
            >
              <Switch style={{ backgroundColor: "#8c8c8c" }} />
            </Form.Item>
            <Form.Item
              name={"role"}
              label="Role"
              rules={[
                {
                  required: true,
                  message: "Please select role",
                },
              ]}
            >
              <Select
                size="large"
                value={role}
                onChange={setRole}
                showSearch
                loading={roleLoading}
                placeholder={"Select role"}
                options={roles?.map((val: any, i: number) => {
                  return {
                    key: i,
                    value: JSON.stringify({ id: val?.id, name: val?.name }),
                    label: val?.name,
                  };
                })}
              />
            </Form.Item>
          </Form>
          <Divider dashed={true} style={{ border: "1px solid gray" }} />
        </div>
      </Modal>
    </div>
  );
};
