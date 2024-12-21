import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@tremor/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  useCancelPipelineMutation,
  useGetPipelineQuery,
  useUpdatePipelineMutation,
} from '../pipeline';
import { useTranslation } from 'react-i18next';

interface HopUIProps {
  name: string;
}

export const HopUI = ({ name }: HopUIProps) => {
  const { t } = useTranslation();
  const { data } = useGetPipelineQuery(name, {
    refetchOnMountOrArgChange: true,
  });
  const [updatePipeline] = useUpdatePipelineMutation();
  const [cancelPipeline] = useCancelPipelineMutation();

  const savePipeline = async () => {
    try {
      const response = await updatePipeline({
        name: data?.name ?? 'Pipeline Name',
        created: data?.created ?? 'Creation Time',
        description: data?.description ?? 'Description',
      });
      if ('data' in response && response.data.status === 'success') {
        await navigateToPipelines();
        toast.success(t('pipelineUpdateSuccess'), {
          position: 'top-right',
        });
        return;
      }
      /* eslint-disable no-console */
      console.error('API failed to update pipeline', response);
      throw new Error('API failed to update pipeline');
    } catch (e) {
      /* eslint-disable no-console */
      console.error('Failed to update pipeline', e);
      await navigateToPipelines();
      toast.error(t('pipelineUpdateError'), { position: 'top-right' });
    }
  };

  const cancelPipelineEditing = async () => {
    try {
      const response = await cancelPipeline(name);
      if ('data' in response && response.data.status === 'success') {
        await navigateToPipelines();
        toast.success(t('pipelineCancelSuccess'), {
          position: 'top-right',
        });
        return;
      }
      throw new Error('API failed to cancel pipeline');
    } catch (e) {
      await navigateToPipelines();
      toast.error(t('pipelineCancelError'), { position: 'top-right' });
    }
  };

  const navigateToPipelines = () => {
    return router.push(`/pipelines`);
  };

  const router = useRouter();
  return (
    <div className="">
      <nav className="mb-5 flex justify-between items-center">
        <div>
          <h2 className="text-3xl">Pipeline : {data?.name}</h2>
          <p className="my-2 text-gray-600">{data?.description}</p>
        </div>
        <div>
          <Button
            icon={XMarkIcon}
            onClick={cancelPipelineEditing}
            className="bg-gray-400 hover:bg-gray-400-hover border-0 mx-1"
          >
            {t('cancel')}
          </Button>
          <Button
            icon={CheckCircleIcon}
            onClick={savePipeline}
            className="bg-prim hover:bg-prim-hover border-0 mx-1"
          >
            {t('validate_pipeline')}
          </Button>
        </div>
      </nav>
      <div>
        <iframe src="/hop/ui" className="w-full h-screen" />
      </div>
    </div>
  );
};
