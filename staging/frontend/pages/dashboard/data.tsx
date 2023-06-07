import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import ListData from "@/components/Data/ListData";
import { useEffect, useState } from "react";
import axios from "axios";
import {IData} from "@/components/Data/ListData";
import secureLocalStorage from "react-secure-storage";

export default function DataPage() {
    const [data, setData] = useState<IData[]>([]); // Specify the type as an array of IData objects

    const [username, setUsername] = useState<string>("")

    useEffect(() => {
        if(typeof window !== undefined && window.localStorage){
            setUsername(secureLocalStorage.getItem("sue") as string)
        }
    }, [])

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const url = "/api/data/get-list-of-uploads/";
                const response = await axios.get<IData[]>(url, {
                    params:{
                        username,
                    }
                });
                // @ts-ignore
                setData(response?.data?.result);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchUploads();
    }, [username]);

    return (
        <DashboardFrame title="List(s) of Uploaded files">
            {data && <ListData data={data} />}
        </DashboardFrame>
    );
}
