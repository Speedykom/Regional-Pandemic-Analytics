import Layout from '@/common/components/Dashboard/Layout';
import { usePermission } from '@/common/hooks/use-permission';
import DataList from '@/modules/data/views/List';

export default function DataPage() {
  const { hasPermission } = usePermission();
  return <Layout>{hasPermission('data:read') && <DataList />}</Layout>;
}
