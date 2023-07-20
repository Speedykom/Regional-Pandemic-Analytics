import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button, Checkbox, Form, Input } from "antd";
import { useState } from "react";
import { ShowMessage } from "@/common/components/ShowMessage";
import jwt_decode from "jwt-decode";
import secureLocalStorage from "react-secure-storage";
import { getUserRole } from "@/common/utils/auth";
import { useLoginMutation } from "../auth";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [login] = useLoginMutation();
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = (data: any) => {
    setLoading(true);

    login(data).then(async (res: any) => {
      if (res.error) {
        setLoading(false);

        ShowMessage("error", "Wrong username or password!");
        return;
      }

      let payload: any = jwt_decode(res.data.access_token);

      secureLocalStorage.setItem("tokens", {
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token,
      });

      secureLocalStorage.setItem("permissions", res.data.permissions);

      // @todo : remove once not needed anymore
      const role = await getUserRole(payload?.realm_access?.roles);
      secureLocalStorage.setItem("user_role", role);

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

      router.push("/home");
    });
  };

  return (
    <>
      <Head>
        <title>Regional Pandemic Analytics Tool | Welcome</title>
      </Head>
      <section className="gradient-form md:h-screen">
        <div className="container mx-auto px-6" style={{ marginTop: "10vh" }}>
          <div className="flex justify-center items-center flex-wrap g-6 text-gray-800">
            <div className="xl:w-10/12">
              <div className="block bg-white shadow-lg rounded-lg">
                <div className="lg:flex lg:flex-wrap g-0">
                  <div className="lg:w-6/12 px-4 md:px-0">
                    <div className="md:p-12 md:mx-6">
                      <div className="text-center">
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
                            rules={[
                              {
                                required: true,
                                message: "Please input your username",
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
                          rules={[
                            {
                              required: true,
                              message: "Please input your password",
                            },
                          ]}
                        >
                          <Input.Password
                            size="large"
                            type="password"
                            placeholder="Password"
                            className="w-full"
                          />
                        </Form.Item>
                        <div className="w-full flex flex-col mb-3 pt-2 md:flex-row md:justify-between">
                          <div className="w-full md:w-1/2 md:mb-0">
                            <Checkbox>Remember Me</Checkbox>
                          </div>
                          <div className="w-full md:w-auto">
                            <a
                              onClick={() =>
                                router.push("/users/reset-password")
                              }
                            >
                              Forgot password
                            </a>
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
                  </div>
                  <div className="bg-prim lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none">
                    <div className="text-white px-4 py-6 md:p-12 md:mx-6">
                      <h4 className="text-2xl font-semibold mb-4">
                        Welcome back!
                      </h4>
                      <p className="text-sm">
                        Simply login to access the IGAD regional pandemic
                        analytics tool to collect, analyze, and report granular
                        and aggregated data from multiple sources for informed
                        decision-making.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
