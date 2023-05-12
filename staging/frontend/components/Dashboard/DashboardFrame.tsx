import Layout from "@/components/Dashboard/Layout";
import { ReactNode } from "react";

interface Props {
    title: string;
    children: ReactNode
}


export default function DashboardFrame(props: Props){

    return(
        <Layout>
            <p className="text-gray-700 text-3xl mb-8 font-bold">{props.title}</p>
            {props.children}
        </Layout>
    )
}