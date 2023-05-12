import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/auth";
import { useAuth } from "@/context/auth";
import { PageLoad } from "@/components/Loader";

export default function App({ Component, pageProps }: AppProps) {
  const { isLoading } = useAuth();
  return (
    <AuthProvider>
      {isLoading ? (
        <PageLoad />
      ) : (
        <>
          <Component {...pageProps} />
          <ToastContainer />
        </>
      )}
    </AuthProvider>
  );
}
