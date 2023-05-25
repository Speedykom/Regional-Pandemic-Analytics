import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import ListData from "@/components/Data/ListData";
import { useEffect, useState } from "react";
import axios from "axios";
import {IData} from "@/components/Data/ListData";

export default function DataPage() {
    const [data, setData] = useState<IData[]>([]); // Specify the type as an array of IData objects

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const url = "/api/data/get-list-of-uploads/";
                const response = await axios.get<IData[]>(url);
                // @ts-ignore
                setData(response?.data?.result);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchUploads();
    }, []);

    return (
        <DashboardFrame title="List(s) of Uploaded files">
            {data && <ListData data={data} />}
        </DashboardFrame>
    );
}
