import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button, Checkbox, Form, Input } from "antd";
import { useState } from "react";
import { useLoginMutation } from "../login";
import { ShowMessage } from "@/components/ShowMessage";
import jwt_decode from "jwt-decode";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = (data: any) => {
    setLoading(true);

    axios
      .post("/api/accounts/login/", JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res: any) => {
        if (res.status == 200) {
          let payload: any = jwt_decode(res?.data?.result?.access_token);

          // @ts-ignore
          secureLocalStorage.setItem("username", payload?.given_name);
          // @ts-ignore
          secureLocalStorage.setItem("sue", payload?.email);
          secureLocalStorage.setItem("userId", payload?.sub);
          secureLocalStorage.setItem("user", payload);
          secureLocalStorage.setItem(
            "passcode",
            Buffer.from(data.password).toString("base64")
          );
          secureLocalStorage.setItem("sua", "authenticated");
          router.push("/dashboard/");
        }
      })
      .catch((res: any) => {
        setLoading(false);
        ShowMessage("error", "Wrong username or password!");
      });
  };

  return (
    <>
      <Head>
        <title>Regional Pandemic Analytics Tool | Welcome</title>
      </Head>
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="bg-white flex w-4/6 shadow-lg rounded-xl overflow-hidden">
          <div className="w-1/2 p-10 pt-5">
            <div className="text-center mb-2">
              <Image
                className="mx-auto w-72"
                src="/images/igad_logo.jpg"
                alt="logo"
                width={500}
                height={200}
              />
            </div>
            <Form
              form={form}
              name="login-user"
              onFinish={onFinish}
              layout="vertical"
              scrollToFirstError
              className="px-8"
            >
              <div>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your dag name",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Username"
                    className="w-full"
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password",
                  },
                ]}
              >
                <Input
                  size="large"
                  type="password"
                  placeholder="Password"
                  className="w-full"
                />
              </Form.Item>
              <div className="w-full flex justify-between mb-3 pt-2">
                <div className="w-1/2">
                  <Checkbox>Remember Me</Checkbox>
                </div>
                <div>
                  <Button
                    type="text"
                    onClick={() => router.push("/users/reset-password")}
                  >
                    Forgot password
                  </Button>
                </div>
              </div>
              <div className="mb-5">
                <Button
                  loading={loading}
                  type="primary"
                  onClick={() => form.submit()}
                  size="large"
                  className="w-full"
                >
                  Login
                </Button>
              </div>
            </Form>
          </div>
          <div className="w-1/2 bg-prim flex justify-center flex-col p-10 text-white">
            <h4 className="text-3xl font-semibold mb-4">Welcome back!</h4>
            <p className="text-base">
              Simply login to access the IGAD regional pandemic analytics tool
              to collect, analyze, and report granular and aggregated data from
              multiple sources for informed decision-making.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
