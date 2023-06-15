import Layout from "@/common/components/Dashboard/Layout";
import { ReactNode, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/router";
import axios from "axios";
import Login from "@/pages/index";

interface Props {
  title?: string;
  children: ReactNode;
  back?: boolean;
  onBackPress?: () => void;
}

export default function DashboardFrame({ children }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const authState = secureLocalStorage.getItem("sua") as string;
      if (authState !== "authenticated") {
        secureLocalStorage.clear();
        axios
          .post("/api/auth/logout/")
          .then(() => {
            setIsAuthenticated(false); // Update isAuthenticated state
            router.push("/");
          })
          .catch((error) => {
            console.log("Logout failed:", error);
            setIsAuthenticated(false); // Update isAuthenticated state
            router.push("/");
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsAuthenticated(true); // Update isAuthenticated state if authenticated
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login />; // Redirect to Login component if not authenticated
  }

  return (
    <Layout>
      <div className="py-10">{children}</div>
    </Layout>
  );
}
