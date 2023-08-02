import getConfig from 'next/config'
import { useEditAccessMutation } from '../pipeline';
import { toast } from 'react-toastify';
import { Button } from '@tremor/react';
 
const { publicRuntimeConfig } = getConfig();

const ViewButton = ({ id }: { id: string }) => {
  const [editAccess, { isLoading }] = useEditAccessMutation();

  const edit = () => {
    editAccess(id).then((res: any) => {
      if (res.error) {
        toast.error(res.error.message, {  });
        return;
      }

      window.open(publicRuntimeConfig.NEXT_PUBLIC_HOP_UI, "_blank");
    });
  };

  return (
    <Button
      loading={isLoading}
      onClick={() => edit()}
      className="hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
    >
      View
    </Button>
  );
};

export default ViewButton;