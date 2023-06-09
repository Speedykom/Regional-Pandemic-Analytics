import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { UserList } from "@/src/modules/user/views/List";

export const LoadUsers = () => {
	return (
		<DashboardFrame title="List(s) of Users">
			<UserList />
		</DashboardFrame>
	);
};

export default function User() {
	return <LoadUsers />;
}
