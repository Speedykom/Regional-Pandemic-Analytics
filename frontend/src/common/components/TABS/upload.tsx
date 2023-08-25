import { TextInput } from '@tremor/react';
import { useState, Fragment } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import {
  ArrowUpOnSquareIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/auth';

interface prop {
  dag: any;
  onClose: () => void;
  state: boolean;
}

export default function LoadData({ state, onClose }: prop) {
  const [fileName, setFileName] = useState<string>('');
  const user = useSelector(selectCurrentUser);
  const email = user?.email || '';
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({});

  const handleDataUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileName) {
      toast.error('Please enter the file name!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }

    const formData = new FormData();

    formData.append('username', email);
    formData.append('file_name', fileName);

    acceptedFiles.forEach((file, index) => {
      formData.append(`uploadedFiles_${index}`, file, file.name);
    });

    axios
      .post('/api/data/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status == 201) {
          toast.success('File uploaded successfully!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        }
      })
      .catch();
  };

  return (
    <Transition.Root show={state} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setFileName(e.target.value);
                            }}
                          />
                          <span className="text-xs tracking-wide text-red-600" />
                        </div>
                        <div className="mt-3">
                          <section className="container">
                            <div
                              {...getRootProps({
                                className:
                                  'dropzone border-dashed border-2 border-gray-300 p-4 rounded-md',
                              })}
                            >
                              <input {...getInputProps()} />
                              <p>
                                Drag 'n' drop some files here, or click to
                                select files
                              </p>
                            </div>
                            {acceptedFiles.length > 0 && (
                              <div>
                                <h4 className="text-lg font-semibold">
                                  Selected Files:
                                </h4>
                                {acceptedFiles.map((file) => (
                                  <p key={file.name} className="mt-2">
                                    {file.name}
                                  </p>
                                ))}
                                <div className="mt-5 sm:mt-6">
                                  <button
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                  >
                                    Upload Data
                                  </button>
                                </div>
                              </div>
                            )}
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
