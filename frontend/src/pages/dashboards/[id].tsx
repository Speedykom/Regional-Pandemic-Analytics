/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { api_url, getGuestToken } from "@/common/utils/auth";
import axios from "axios";
import { useRouter } from "next/router";
import { Breadcrumb } from "antd";
import Link from "next/link";
import Layout from "@/common/components/layout";

export default function SupersetDashboard() {
  let ref = useRef<HTMLDivElement>(null);
  const [uuid, setUuid] = useState("");
  const router = useRouter();

  const viewDash = async (id: string) => {
    const response = await axios.get(
      `${api_url}/api/superset/dashboard/embed/${router.query?.id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 404) {
      await axios
        .post(
          `${api_url}/api/superset/dashboard/enable-embed`,
          {
            uid: router.query?.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const dashboardUUID = res?.data?.result?.uuid;
          setUuid(dashboardUUID);
        });
    } else {
      setUuid(response.data?.result?.uuid);
    }
  };

  const embedDash = async () => {
    if (ref.current) {
      await embedDashboard({
        id: uuid, // given by the Superset embedding UI
        supersetDomain: `${process.env.NEXT_PUBLIC_SUPERSET_URL}`,
        mountPoint: ref.current, // html element in which iframe render
        fetchGuestToken: () => getGuestToken(uuid),
        dashboardUiConfig: {
          hideTitle: true,
          hideTab: true,
          filters: {
            expanded: false,
            visible: false,
          },
        },
      });
    }
  };

  useEffect(() => {
    embedDash();
  }, [embedDash]);

  return (
    <Layout title="View Dashboard">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl mb-2">View Dashboard</h2>
          <Breadcrumb
            items={[
              {
                title: <Link href="/home">Home</Link>,
              },
              {
                title: <Link href="/dashboards">Dashboard</Link>,
              },
              {
                title: "View Dashboard",
              },
            ]}
          />
        </div>
      </div>
      <div ref={ref} className="h-screen embed-iframe-container mb-8" />
    </Layout>
  );
}
