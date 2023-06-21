import { Unauthorised } from "@/common/components/common/unauth";
import Layout from "@/common/components/layout";
import { RoleList } from "@/modules/roles/views/List";
import secureLocalStorage from "react-secure-storage";

export const LoadRoles = () => {
  const userRole: any = secureLocalStorage.getItem("user_role");
  const permits = userRole?.attributes;
  return (
    <Layout title="Roles">
      {permits?.Role && permits?.Role?.read ? <RoleList /> : <Unauthorised />}
    </Layout>
  );
};

export default function Role() {
  return <LoadRoles />;
}
