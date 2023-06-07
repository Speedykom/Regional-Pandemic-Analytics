import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import Dag from "@/components/TABS/Dag";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, useMemo } from "react";
import {
  ClockIcon,
  FingerPrintIcon,
  AdjustmentsHorizontalIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { TextInput } from "@tremor/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Router from "next/router";
import { Button, Form, Input, message, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

type FormValues = {
  dagName: string;
  dagID: string;
  dagPath: string;
  scheduleInterval: string;
  parquetPath: string;
  dataSource: string;
};

export default function ProcessChains() {
  const [open, setOpen] = useState(false);
  const [openHopModal, setOpenHopModal] = useState(false);
  const [hopTemplate, setHopTemplate] = useState([]);
  const [selectedHopTemplate, setSelectedHopTemplate] = useState("");
  const [isShowNewTemplateForm, SetIsShowNewTemplateForm] = useState(false);
  const [form] = Form.useForm();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit = handleSubmit((data) => {
    const dagData = {
      dag_name: data?.dagName,
      dag_id: data?.dagID,
      path: data?.dagPath,
      schedule_interval: data?.scheduleInterval,
      parquet_path: data?.parquetPath,
      data_source_name: data?.dataSource,
      // hop_template: selectedHopTemplate,
    };
    axios
      .post("http://localhost:/api/process", dagData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(data);
    setOpen(false);
  });

  const fetchHops = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/`;
      await axios
        .get(url, {
          headers: {
            Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
            // `Bearer ${token}`
          },
        })
        .then((res) => {
          const templates: any = [];
          res?.data?.data?.map((data: any, index: number) => {
            const template = {
              value: data,
              label: data,
            };
            templates.push(template);
          });
          setHopTemplate(templates);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useMemo(() => {
    fetchHops();
  }, []);

  const handleBtnClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    modalType: string
  ) => {
    if (modalType === "gotoProcessChain") {
      setOpenHopModal(false);
      setOpen(!open);
    }
    if (modalType === "gotoHopTemplate") {
      setOpen(false);
      setOpenHopModal(!openHopModal);
    }
  };

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
        fetchHops();
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

  return (
    <DashboardFrame title="List(s) of Process Chains">
      {/* process chain modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <form onSubmit={onSubmit}>
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <AdjustmentsHorizontalIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Process Chain
                        </Dialog.Title>
                        <div className="mt-2">
                          <div>
                            <TextInput
                              icon={AdjustmentsHorizontalIcon}
                              placeholder="Name of Process Chain"
                              {...register("dagName")}
                            />
                          </div>
                          <div className="mt-3">
                            <TextInput
                              icon={FingerPrintIcon}
                              placeholder="Process Chain ID"
                              {...register("dagID")}
                            />
                          </div>
                          <div className="mt-3">
                            <TextInput
                              icon={ChevronDoubleRightIcon}
                              placeholder="Path to Process Chain"
                              {...register("dagPath")}
                            />
                          </div>
                          <div className="mt-3">
                            <TextInput
                              icon={ClockIcon}
                              placeholder="Schedule Interval"
                              {...register("scheduleInterval")}
                            />
                          </div>
                          <div className="mt-3">
                            <TextInput
                              icon={ClockIcon}
                              placeholder="Parquet Path"
                              {...register("parquetPath")}
                            />
                          </div>
                          <div className="mt-3">
                            <TextInput
                              icon={ClockIcon}
                              placeholder="Data Source Name"
                              {...register("dataSource")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 flex space-x-2">
                      <button
                        type="button"
                        onClick={(e) => handleBtnClick(e, "gotoProcessChain")}
                        className="inline-flex w-10 justify-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* add/create new hop template */}
      <Transition.Root show={openHopModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenHopModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <form>
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <AdjustmentsHorizontalIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Hop Template
                        </Dialog.Title>
                        <div className="mt-2">
                          {/* content container */}
                          <div>
                            {!isShowNewTemplateForm ? (
                              // select component
                              <Select
                                placeholder="Please select an hop template"
                                className="w-full"
                                onChange={(value) =>
                                  setSelectedHopTemplate(value)
                                }
                                options={hopTemplate}
                              />
                            ) : (
                              // upload new template form component
                              <Form
                                {...formItemLayout}
                                form={form}
                                name="uploadFile"
                                onFinish={handleUpload}
                                scrollToFirstError
                                size="large"
                                className="w-full -mb-8 mt-5"
                              >
                                <Form.Item
                                  name="filename"
                                  label="File Name"
                                  className="w-full -ml-5"
                                >
                                  <Input className="w-[15rem]" />
                                </Form.Item>
                                <Form.Item
                                  name="file"
                                  label="Select File"
                                  className="w-full -ml-5"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please select the file",
                                    },
                                  ]}
                                >
                                  <Upload {...props} className="w-[15rem]">
                                    <Button
                                      icon={<UploadOutlined />}
                                      className="w-[15rem]"
                                    >
                                      Select File
                                    </Button>
                                  </Upload>
                                </Form.Item>
                              </Form>
                            )}
                          </div>

                          <div className="relative flex py-5 items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-300">
                              or
                            </span>
                            <div className="flex-grow border-t border-gray-300"></div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              SetIsShowNewTemplateForm(!isShowNewTemplateForm)
                            }
                            className="text-gray-500 cursor-pointer hover:text-blue-500"
                          >
                            {!isShowNewTemplateForm
                              ? "Create a new template"
                              : "Select a template"}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* button section */}
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        disabled={selectedHopTemplate === "" ? true : false}
                        onClick={(e) => handleBtnClick(e, "gotoProcessChain")}
                        className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* trigger button */}
      <button
        onClick={(e) => handleBtnClick(e, "gotoHopTemplate")}
        className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
      >
        Add Process Chain
      </button>
      <Dag />
    </DashboardFrame>
  );
}
