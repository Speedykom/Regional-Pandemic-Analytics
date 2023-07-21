import Layout from "@/common/components/Dashboard/Layout";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "@/modules/auth/auth";

interface Props {
  title?: string;
  children: ReactNode;
  back?: boolean;
  onBackPress?: () => void;
}

export default function DashboardFrame({ children }: Props) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="py-10">{children}</div>
    </Layout>
  );
}
