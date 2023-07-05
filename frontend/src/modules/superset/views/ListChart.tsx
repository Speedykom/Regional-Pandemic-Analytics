import { useDashboards } from "../hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { IGADTable } from "@/common/components/common/table";
import { getData } from "@/common/utils";
import { useCharts } from "../hooks/chart";
import getConfig from 'next/config'
 
const { publicRuntimeConfig } = getConfig()

export const ChartList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({ count: 0, result: [] });

  const [token, setToken] = useState<string>("");

  const fetchToken = async () => {
    try {
      const url = "/api/get-access-token/";
      const response = await getData(url);
      setToken(response?.accessToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchCharts = async () => {
      try {
        const url = `${publicRuntimeConfig.NEXT_PUBLIC_SUPERSET_URL}/api/v1/chart/`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchCharts();
  }, [token]);

  const { columns } = useCharts();

  return (
    <div className="">
      <nav>
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl">Superset Charts</h2>
            <p className="mt-2 text-gray-600">
              Chart list created on Apache Superset.
            </p>
          </div>
        </div>
      </nav>
      <section className="mt-2">
        <div className="py-2">
          <IGADTable
            key={"id"}
            loading={loading}
            rows={data.result}
            columns={columns}
          />
        </div>
      </section>
    </div>
  );
};
