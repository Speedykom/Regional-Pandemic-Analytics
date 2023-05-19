import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import axios from "axios";
import { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
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
  );
}
