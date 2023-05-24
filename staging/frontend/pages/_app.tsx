import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import axios from "axios";
import { AppProps } from "next/app";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) =>
          axios.get(resource, init).then((res) => res.data),
      }}
    >
      <Provider store={store}>
        <Component {...pageProps} />
        <ToastContainer />
      </Provider>
    </SWRConfig>
  );
}
