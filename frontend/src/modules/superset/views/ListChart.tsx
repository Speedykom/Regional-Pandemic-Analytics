import { useDashboards } from "../hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { IGADTable } from "@/common/components/common/table";
import { getData } from "@/common/utils";
import { useCharts } from "../hooks/chart";
import getConfig from 'next/config'
import secureLocalStorage from "react-secure-storage";
 
const { publicRuntimeConfig } = getConfig()

export const ChartList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({ count: 0, result: [] });

  const tokens: any = secureLocalStorage.getItem("tokens");
	const accessToken = tokens && 'accessToken' in tokens ? tokens.accessToken : '' 

  useEffect(() => {
    setLoading(true);
    const fetchCharts = async () => {
      try {
        const url = `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/superset/list/charts`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
        });
        setData(response?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchCharts();
  }, [accessToken]);

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
