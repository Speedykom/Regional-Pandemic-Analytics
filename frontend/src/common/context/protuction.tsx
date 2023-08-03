import { Loading } from "../components/Loading";
import { useRouter } from "next/router";
import { useAuth } from "./auth";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const ProtectRoute = ({ children }: Props) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  else if (!isAuthenticated && window.location.pathname !== "/login") {
    router.push("/login");
    return <Loading />;
  }

  return <>{children}</>;
};
