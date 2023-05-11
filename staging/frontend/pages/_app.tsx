import '@/styles/globals.css'
import { SWRConfig } from 'swr';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app'
import {SessionProvider} from "next-auth/react";

export default function App({ Component, pageProps:{ session, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session}>
            <SWRConfig
                value={{
                    refreshInterval: 3000,
                    fetcher: (resource, init) =>
                        axios.get(resource, init).then((res) => res.data),
                }}
            >
                <Component {...pageProps} />
                <ToastContainer />
            </SWRConfig>
        </SessionProvider>

    );
}