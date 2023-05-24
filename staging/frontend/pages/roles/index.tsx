import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { RoleList } from "@/src/module/roles/views/List";

export const LoadUsers = () => {
	
	return (
		<DashboardFrame title="List(s) of Users">
			<RoleList />
		</DashboardFrame>
	);
};

export default function User() {
	return <LoadUsers />;
}
