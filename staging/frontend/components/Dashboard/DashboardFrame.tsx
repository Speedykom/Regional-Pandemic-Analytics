import Layout from "@/components/Dashboard/Layout";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    title: string;
}


export default function DashboardFrame(props: Props){
    const sessionData = useSession()
    const router = useRouter()
    if(sessionData?.status == 'unauthenticated'){
        router.push("/")
        return null
    }
    return(
        <Layout>
            <p className="text-gray-700 text-3xl mb-8 font-bold">{props.title}</p>
            {props.children}
        </Layout>
    )
}