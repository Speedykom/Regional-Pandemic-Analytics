import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import ListDashboards from "@/components/Superset/ListDashboards";
import useSWR from "swr";
import {axiosFetcher} from "@/libs/fetcher";


export default function SupersetDashboard(){
    const url = `https://analytics2.igad-health.eu/api/v1/dashboard/`;
    const username: string = process.env.SUPERSET_USERNAME!;
    const password: string = process.env.SUPERSET_PASSWORD!;
    const { data, error } = useSWR(
        [url, username, password],
        ([url, username, password]) => axiosFetcher(url, username, password)
    );


    if(error){
        console.log(error)
    }

    console.log(process.env.SUPERSET_URL)

    return(
        <DashboardFrame title="List(s) of Dashboards">
            <div className="mb-4">
                <ListDashboards data={data}/>
            </div>
        </DashboardFrame>
    )
}