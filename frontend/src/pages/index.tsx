import AnalyticsCard from "@/common/components/Dashboard/AnalyticsCard";
import TimeSeries from "@/common/components/Dashboard/TimeSeries";
import Layout from "@/common/components/layout";

export default function Home() {
  return (
    <Layout title="Dashboard">
      <div className="">
        <AnalyticsCard />
      </div>
      <div className="mt-3 mb-3">
        <TimeSeries />
      </div>
    </Layout>
  );
}
