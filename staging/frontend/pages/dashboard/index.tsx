import Head from "next/head";
import { Inter } from "next/font/google";
import AnalyticsCard from "@/components/Dashboard/AnalyticsCard";
import TimeSeries from "@/components/Dashboard/TimeSeries";
import DashboardFrame p from "@/components/Dashboard/DashboardFrame";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Dashboard | RePAN</title>
        <meta name="description" content="SpeedyKom" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <DashboardFrame title="Dashboard">
        <div className="">
          <AnalyticsCard />
        </div>
        <div className="mt-3 mb-3">
          <TimeSeries />
        </div>
      </DashboardFrame>
    </>
  );
}
