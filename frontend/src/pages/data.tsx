import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import ListData from "@/common/components/Data/ListData";
import { useEffect, useState } from "react";
import axios from "axios";
import {IData} from "@/common/components/Data/ListData";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/modules/auth/auth";

export default function DataPage() {
    const [data, setData] = useState<IData[]>([]); // Specify the type as an array of IData objects
    const user = useSelector(selectCurrentUser);
    const email = user?.email;

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const url = "/api/data/get-list-of-uploads/";
                const response = await axios.get<IData[]>(url, {
                    params:{
                        username: email,
                    }
                });
                // @ts-ignore
                setData(response?.data?.result);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        if(email) {
            fetchUploads();
        }
    }, [email]);

    return (
        <DashboardFrame title="List(s) of Uploaded files">
            {data && <ListData data={data} />}
        </DashboardFrame>
    );
}
