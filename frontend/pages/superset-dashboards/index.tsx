import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { useEffect, useState } from "react";
import ListDashboards, {
  IListDashboardsProps,
} from "@/components/Superset/ListDashboards";
import { getData } from "@/utils";
import axios from "axios";

export default function SupersetDashboard() {
  const [data, setData] = useState<IListDashboardsProps["data"]>({
    count: 0,
    result: [],
  });

  const [token, setToken] = useState("");

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
    const fetchDashboards = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SUPERSET_URL}/api/v1/dashboard/`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response?.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchDashboards();
  }, [token]);

  return (
    <DashboardFrame title="List(s) of Dashboards">
      <div className="mb-4">
        <ListDashboards data={data} />
      </div>
    </DashboardFrame>
  );
}
