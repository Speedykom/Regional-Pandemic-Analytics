import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import {useEffect, useState} from "react";
import {getData} from "@/utils";
import axios from "axios";
import ListCharts from "@/components/Superset/ListCharts";


export default function Charts() {
    const [data, setData] = useState({})

    const [token, setToken] = useState("")

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
            <ListCharts data={data}/>
        </DashboardFrame>
    )
}