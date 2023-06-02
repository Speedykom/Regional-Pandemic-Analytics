import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { RoleList } from "@/src/module/roles/views/List";

export const LoadRoles = () => {
  return (
    <DashboardFrame title="List(s) of Hops">
      <RoleList />
    </DashboardFrame>
  );
};

export default function Hops() {
  return <LoadRoles />;
}
