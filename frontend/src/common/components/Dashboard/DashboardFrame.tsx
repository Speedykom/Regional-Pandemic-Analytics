import Layout from "@/common/components/Dashboard/Layout";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/modules/auth/auth";

interface Props {
  title?: string;
  children: ReactNode;
  back?: boolean;
  onBackPress?: () => void;
}

export default function DashboardFrame({ children }: Props) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, []);

  return (
    <Layout>
      <div className="mx-16 py-10">{children}</div>
    </Layout>
  );
}
