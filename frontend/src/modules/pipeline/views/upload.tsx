import Drawer from '@/common/components/common/Drawer';
import { Button, TextInput } from '@tremor/react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useUploadPipelineMutation } from '../pipeline';
interface UploadPipelineProps {
  state: boolean;
  onClose: () => void;
  template: any;
  refetch: () => void;
}

export const UploadPipeline = ({
  state,
  onClose,
  refetch,
}: UploadPipelineProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const [uploadPipeline, { isLoading }] = useUploadPipelineMutation();
  const isWhitespace = /\s/;
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({});

  const onFinish = (value: any) => {
    const file = acceptedFiles[0];
    // Create a FormData object
    const formData = new FormData();
    formData.append('name', value.name);
    formData.append('description', value.description);
    formData.append('uploadedFile', file, file.name);
    uploadPipeline(formData).then((res: any) => {
      if (res.error) {
        const { data } = res.error;
        const { message } = data;
        toast.error(message, { position: 'top-right' });
        return;
      }

      toast.success('Process created successfully', {
        position: 'top-right',
      });
      cancel();
      refetch();
    });
  };

  const cancel = () => {
    reset();
    onClose();
  };

  const handleValueChange = (value: string) => {
    if (isWhitespace.test(value)) {
      setError('name', {
        type: 'pattern',
        message: 'Pipeline name cannot contain whitespaces',
      });
    } else {
      clearErrors('name');
    }
  };

  const footer = (
    <div className="flex justify-start space-x-2 px-3 mb-3">
      <Button
        type="submit"
        loading={isLoading}
        disabled={!!errors.name || !!errors.description}
        className="bg-prim text-white border-0 hover:bg-prim-hover"
        onClick={handleSubmit((values: any) => onFinish(values))}
      >
        Upload
      </Button>
      <Button
        onClick={cancel}
        className="bg-blue-100 px-4 py-2 text-sm text-blue-900 hover:bg-blue-200 border-0"
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <Drawer
      title="Upload Pipeline"
      isOpen={state}
      onClose={cancel}
      placement="right"
      width={350}
      footer={footer}
    >
      <div className="w-96 px-3">
        <form name="add-pipeline">
          <div className="relative w-full mb-3">
            <label
              className="block text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="descriptiond"
            >
              Name*
            </label>
            <TextInput
              {...register('name', {
                required: {
                  value: true,
                  message: 'Please enter a pipeline name',
                },
                pattern: {
                  value: /^\S*$/,
                  message: 'Pipeline name cannot contain whitespaces',
                },
                onChange: (event: any) =>
                  handleValueChange(event.target?.value),
              })}
              error={!!errors.name}
              errorMessage={errors?.name?.message?.toString()}
              type="text"
              className="w-full h-12"
              placeholder="Enter Name"
            />
          </div>
          <div className="relative w-full mb-3">
            <label
              className="block text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="descriptiond"
            >
              Description*
            </label>
            <TextInput
              {...register('description', {
                required: true,
              })}
              error={!!errors.description}
              errorMessage={
                errors.description ? 'Please enter your description' : ''
              }
              type="text"
              className="w-full h-12"
              placeholder="Enter Description"
            />
          </div>
          <div className="relative w-full mb-3">
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <div className="mt-2">
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
                          Drag 'n' drop .hlp pipeline file here, or click to
                          select a file
                        </p>
                      </div>
                      {acceptedFiles.length === 1 && (
                        <div>
                          <h4 className="text-lg font-semibold">
                            Selected Files:
                          </h4>
                          {acceptedFiles.map((file) => (
                            <p key={file.name} className="mt-2">
                              {file.name}
                            </p>
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Drawer>
  );
};
