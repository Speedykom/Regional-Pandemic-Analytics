import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { RoleList } from "@/src/modules/roles/views/List";

export const LoadRoles = () => {
	
	return (
		<DashboardFrame title="List(s) of Roles">
			<RoleList />
		</DashboardFrame>
	);
};

export default function Role() {
	return <LoadRoles />;
}
