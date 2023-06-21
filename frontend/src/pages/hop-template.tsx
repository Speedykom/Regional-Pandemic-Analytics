import Layout from "@/common/components/layout";
import { HopList } from "@/modules/template/views/List";

export const LoadHops = () => {
  return (
    <Layout title="List(s) of Hops">
      <HopList />
    </Layout>
  );
};

export default function Hops() {
  return <LoadHops />;
}
