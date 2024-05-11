import Drawer from '@/common/components/common/Drawer';
import { Button, TextInput } from '@tremor/react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useCreatePipelineMutation } from '../pipeline';
import { useTranslation } from 'react-i18next';

interface AddPipelineProps {
  state: boolean;
  onClose: () => void;
  template: any;
  refetch: () => void;
}

export const AddPipeline = ({
  state,
  onClose,
  template,
  refetch,
}: AddPipelineProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const [addPipeline, { isLoading }] = useCreatePipelineMutation();
  const unpermittedCharactersRegex = /[!"#$%&'()*+,\-\s.\/:;<=>?@\[\]^`{|}~]/; //includes whitespace
  const { t } = useTranslation();

  const onFinish = (value: any) => {
    addPipeline({ ...value, template: template.name }).then((res: any) => {
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
    if (unpermittedCharactersRegex.test(value)) {
      setError('name', {
        type: 'pattern',
        message: t('pipelineInvalidName'),
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
        Submit
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
      title="Add Pipeline"
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
                  value: /^(?!.*[!"#$%&'()*+,\-\s.\/:;<=>?@\[\]^`{|}~]).*$/,
                  message: t('pipelineInvalidName'),
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
              htmlFor="path"
            >
              Template
            </label>
            <TextInput
              disabled
              placeholder={template?.name}
              className="w-full"
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
        </form>
      </div>
    </Drawer>
  );
};
