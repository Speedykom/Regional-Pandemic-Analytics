import { Loading } from '@/common/components/Loading';
import { CreatePassword } from '@/modules/user/views/create-password';
import { LinkExpired } from '@/modules/user/views/link-expired';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function CreatePasswordLayout() {
  const router = useRouter();
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { tok } = router.query;
  const getToken = async () => {
    setIsLoading(true);
    await axios
      .patch(
        `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/auth/request-verify`,
        {
          token: String(tok),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setValid(true);
        setEmail(res?.data?.email);
      })
      .catch(() => {
        setIsLoading(false);
        setValid(false);
      });
  };

  useEffect(() => {
    getToken();
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!valid) {
    return <LinkExpired />;
  }

  return <CreatePassword mail={email} token={String(tok)} />;
}
