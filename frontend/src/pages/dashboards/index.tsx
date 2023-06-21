import { Unauthorised } from "@/common/components/common/unauth";
import Layout from "@/common/components/layout";
import { DashboardList } from "@/modules/superset/views/List";
import secureLocalStorage from "react-secure-storage";

export const Dashboards = () => {
  const userRole: any = secureLocalStorage.getItem("user_role");
  const permits = userRole?.attributes;
  return (
    <Layout title="Dashboard">
      {permits?.Dashboard && permits?.Dashboard?.read ? (
        <DashboardList />
      ) : (
        <Unauthorised />
      )}
    </Layout>
  );
};

export default function Dashboard() {
  return <Dashboards />;
}
