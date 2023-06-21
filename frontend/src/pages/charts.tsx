import Layout from "@/common/components/layout";
import { ChartList } from "@/modules/superset/views/ListChart";

export default function Charts() {

  
  return (
    <Layout title="List of Chart(s)">
      <ChartList />
    </Layout>
  );
}
