import { BarChart, Card, Grid, Metric, Subtitle, Title } from "@tremor/react";
import { useEffect } from "react";
import getConfig from 'next/config'
import MetricsCards from "@/common/components/Cards/MetricsCard";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import useSWR from "swr";

interface IBarData {
  country: string;
  total_death: number;
}

const { publicRuntimeConfig } = getConfig()

export default function Dashboard() {
  const { data: metrics, error: metricsError } = useSWR(
    `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/global-data/`
  );
  const { data, error, isLoading } = useSWR(
    `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/covid-data/`
  );
  const filteredData = data
    ? data.map((item: IBarData) => ({
        country: item?.country,
        "Number of Covid19 Deaths": item?.total_death,
      }))
    : [];

  const getGuestToken = async () => {
    const response = await fetch("/api/get-guest-token/");
    const token = await response.json();
    return token?.guestToken;
  };

  useEffect(() => {
    const embed = async () => {
      await embedDashboard({
        id: "5e676cb1-7330-4eed-9e1a-d432de97da5e",
        supersetDomain: "http://localhost:8080",
        mountPoint:
          document.getElementById("igad-covid-dashboard") ||
          document.createElement("div"),
        fetchGuestToken: () => getGuestToken(),
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: true,
          hideTab: true,
        },
      });
    };

    if (document.getElementById("igad-covid-dashboard")) {
      embed();
    }
  });

  return (
    <>
      <Metric className="mt-5">Covid19 - Global Stats</Metric>
      <Grid numColsMd={1} numColsLg={1}>
        <div id="igad-covid-dashboard" style={{ width: "100%" }} />
      </Grid>
      <Grid numColsMd={2} numColsLg={6} className="mt-6 gap-6">
        <MetricsCards
          title="New Confirmed"
          count={metrics?.new_confirmed ?? 0}
        ></MetricsCards>
        <MetricsCards
          title="Total Confirmed"
          count={metrics?.total_confirmed ?? 0}
        ></MetricsCards>
        <MetricsCards
          title="New Death"
          count={metrics?.new_death ?? 0}
        ></MetricsCards>
        <MetricsCards
          title="Total Death"
          count={metrics?.total_death ?? 0}
        ></MetricsCards>
        <MetricsCards
          title="New Recovered"
          count={metrics?.new_recovered ?? 0}
        ></MetricsCards>
        <MetricsCards
          title="Total Recovered"
          count={metrics?.total_recovered ?? 0}
        ></MetricsCards>
      </Grid>

      <div className="mt-6">
        <Card>
          <Title>
            The data shows the count of deaths related to COVID-19 categorized
            by country.
          </Title>
          <Subtitle>
            It provides valuable insights for comparing the pandemic's impact
            across different countries and informing public health policy
            decisions.
          </Subtitle>
          <BarChart
            className="mt-6"
            data={filteredData}
            index="country"
            categories={["Number of Covid19 Deaths"]}
            colors={["blue"]}
            //yAxisWidth={48}
          />
        </Card>
      </div>
    </>
  );
}
