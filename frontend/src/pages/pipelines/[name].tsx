import { Unauthorized } from '@/common/components/common/unauth';
import Layout from '@/common/components/Dashboard/Layout';
import { usePermission } from '@/common/hooks/use-permission';
import { HopUI } from '@/modules/pipeline/views/HopUI';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function Pipeline() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const { name } = router.query as { name: string };
  const { t } = useTranslation();

  useEffect(() => {
    if (name && hasPermission('pipeline:read')) {
      toast.info(t('hop.firstMessage'), {
        position: 'bottom-right',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <Layout>
      {hasPermission('pipeline:read') && name ? (
        <HopUI name={name} />
      ) : (
        <Unauthorized />
      )}
    </Layout>
  );
}
