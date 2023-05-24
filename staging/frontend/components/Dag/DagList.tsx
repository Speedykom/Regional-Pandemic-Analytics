import { Dialog, Switch, Transition } from "@headlessui/react";

import React, { Fragment, useEffect, useState } from "react";
import { Dropdown, DropdownItem } from "@tremor/react";
import { Flex, TextInput } from "@tremor/react";
import { DagType } from "../TABS/interface";
import {
  ArrowUpOnSquareIcon,
  DocumentTextIcon,
  CubeIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";
import {toast} from "react-toastify";
import axios from 'axios'
import secureLocalStorage from "react-secure-storage";


interface IDag {
  [key: string]: unknown;
}

interface Props {
  dag: DagType;
}

export default function DagList({ dag }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [fileName, setFIleName] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")
  const [file, setFile] = useState<File>()

  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage){
      setUsername(secureLocalStorage.getItem("sue") as string)
    }
  }, [])

  useEffect(() => {
    setEnabled(dag?.isActive);
  }, [dag]);

  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!open);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (!fileList) return;

    setFile(fileList[0]);
  }

  const handleDataUpload = (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    if(!fileName){
      toast.error('Please enter the file name!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return
    }

    if(!fileType){
      toast.error('Please select a file type!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return
    }

    if(!file){
      toast.error('Please upload a file!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return
    }

    const formData = new FormData()

    formData.append("username", username)
    formData.append('file_name', fileName)
    formData.append('file_type', fileType)
    formData.append('file', file, file['name'])

    axios.post('/api/data/upload/', formData, {
      headers:{
        "Content-Type": "multipart/form-data"
      }
    }).then(response =>{
      if(response.status == 201){
        toast.success('File uploaded successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    })
        .catch(error => {

        })
  }

  return (
    <Flex className="w-full space-y-5 ">
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
                  <form onSubmit={handleDataUpload}>
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <ArrowUpOnSquareIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Upload Data
                        </Dialog.Title>
                        <div className="mt-2">
                          <div>
                            <TextInput
                              icon={DocumentTextIcon}
                              placeholder="Name of data file"
                              name="fileName"
                              value={fileName}
                              onChange={(e:React.ChangeEvent<HTMLInputElement>) => {setFIleName(e.target.value)}}
                            />
                            <span className="text-xs tracking-wide text-red-600">

                            </span>
                          </div>
                          <div className="mt-3">
                            <Dropdown
                              className="mt-2"
                              value={fileType}
                              onValueChange={(value) =>
                                setFileType(value)
                              }
                              placeholder="Please select file extension"
                            >
                              <DropdownItem
                                value="csv"
                                text="csv"
                                icon={CubeTransparentIcon}
                              />
                              <DropdownItem
                                value="excel"
                                text="excel"
                                icon={CubeTransparentIcon}
                              />
                              <DropdownItem
                                value="json"
                                text="json"
                                icon={CubeIcon}
                              />
                            </Dropdown>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-center w-full">
                              <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <svg
                                    aria-hidden="true"
                                    className="w-10 h-10 mb-3 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    ></path>
                                  </svg>
                                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">
                                      Click to upload
                                    </span>{" "}
                                    or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                  </p>
                                </div>
                                <input
                                  id="dropzone-file"
                                  type="file"
                                  className="hidden"
                                  name="file"
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>
                            <span className="text-xs tracking-wide text-red-600">

                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Upload Data
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div>
        <button
          onClick={handleBtnClick}
          className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
        >
          Load Data
        </button>
      </div>
      <div>
        <h4>{dag?.dagId}</h4>
      </div>
      <div>
        <h6>{dag?.description}</h6>
      </div>
      <div className="flex space-x-2">
        <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white">
          Edit
        </button>
        <button className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white focus:outline-none focus:bg-green-500 focus:text-white">
          Run
        </button>
        <button className="px-3 py-1 border border-purple-500 text-purple-500 rounded-md hover:bg-purple-500 hover:text-white focus:outline-none focus:bg-purple-500 focus:text-white">
          View pipeline
        </button>
        <button className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white focus:outline-none focus:bg-red-500 focus:text-white">
          Delete
        </button>
      </div>
      <div>
        <label className="flex items-center">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${enabled ? "bg-teal-900" : "bg-red-600"}
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={`${enabled ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="ml-2">Auto run</span>
        </label>
      </div>
      <div>
        <h4>Status: ok</h4>
      </div>
    </Flex>
  );
}
