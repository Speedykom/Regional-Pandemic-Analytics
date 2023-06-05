import Layout from "@/components/Dashboard/Layout";
import { ReactNode, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/router";
import axios from "axios";
import Login from "@/pages/index";
import { BiArrowBack } from "react-icons/bi";

interface Props {
  title: string;
  children: ReactNode;
  back?: boolean;
  onBackPress?: () => void;
}

export default function DashboardFrame({
  title,
  back,
  onBackPress,
  children,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   if (typeof window !== "undefined" && window.localStorage) {
  //     const authState = secureLocalStorage.getItem("sua") as string;
  //     if (authState !== "authenticated") {
  //       secureLocalStorage.clear();
  //       axios
  //         .post("/api/accounts/logout/")
  //         .then((response) => {
  //           setIsAuthenticated(false); // Update isAuthenticated state
  //           router.push("/");
  //         })
  //         .catch((error) => {
  //           console.log("Logout failed:", error);
  //           setIsAuthenticated(false); // Update isAuthenticated state
  //           router.push("/");
  //         })
  //         .finally(() => {
  //           setIsLoading(false);
  //         });
  //     } else {
  //       setIsAuthenticated(true); // Update isAuthenticated state if authenticated
  //       setIsLoading(false);
  //     }
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!isAuthenticated) {
  //   return <Login />; // Redirect to Login component if not authenticated
  // }

  return (
    <Layout>
      <div className="flex items-center space-x-5 mb-8">
        {back ? (
          <button onClick={onBackPress}>
            <BiArrowBack className="text-2xl" />
          </button>
        ) : null}
        <p className="text-gray-700 text-3xl font-bold">{title}</p>
      </div>
      {children}
    </Layout>
  );
}
