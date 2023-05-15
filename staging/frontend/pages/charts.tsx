import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import {useEffect, useState} from "react";
import {getData} from "@/utils";
import axios from "axios";
import ListCharts from "@/components/Superset/ListCharts";

type TChartData = {
    count: number;
    result: TItem[]; // Updated type to TItem[]
};

type TItem = {
    [key: string]: string;
    slice_name: string;
    viz_type: string;
    datasource_name_text: string;
    changed_by_name: string;
    changed_on_delta_humanized: string;
    created_by_name: string;
};

export default function Charts() {
    const [data, setData] = useState<TChartData>({ count: 0, result: [] });

    const [token, setToken] = useState<string>("")

    const fetchToken = async () => {
        try {
            const url = '/api/get-access-token/';
            const response = await getData(url);
            setToken(response?.accessToken);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchCharts = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_SUPERSET_URL}/api/v1/chart/`;
            const response = await axios.get(url, {headers:{
                    'Authorization': `Bearer ${token}`
                }});
            setData(response?.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        fetchToken();
    }, [])

    useEffect(() => {
        fetchCharts();
    }, [token])
    return(
        <DashboardFrame title="List of Chart(s)">
            {data && <ListCharts data={data} />}
        </DashboardFrame>
    )
}