import { useDashboards } from "../hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { api_url } from "@/common/utils/auth";
import { IGADTable } from "@/common/components/common/table";
import { IUser } from "@/modules/user/interface";
import { Breadcrumb } from "antd";
import Link from "next/link";

export const DashboardList = () => {
  const [data, setData] = useState<Array<IUser>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchDashboards = async () => {
    try {
      setLoading(true);
      const url = `${api_url}/api/superset/list`;
      await axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setLoading(false);
          setData(res?.data?.result);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const rowAction = (id: string) => {
    router.push(`/dashboards/${id}`);
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  const { columns } = useDashboards();
  return (
    <div className="">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl mb-2">Dashboard</h2>
          <Breadcrumb
            items={[
              {
                title: <Link href="/home">Home</Link>,
              },
              {
                title: "Dashboard",
              },
            ]}
          />
        </div>
      </div>
      <section className="mt-2">
        <div className="py-2">
          <IGADTable
            key={"id"}
            loading={loading}
            rows={data}
            columns={columns}
            onRow={(record: any) => ({
              onClick: () => rowAction(record.id),
            })}
          />
        </div>
      </section>
    </div>
  );
};
