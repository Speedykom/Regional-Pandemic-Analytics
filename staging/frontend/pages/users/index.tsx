import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { UserList } from "@/src/module/user/views/List";
import { appRoles, roles } from "@/utils/auth";

export const LoadUsers = () => {
	return (
		<div>
			{roles?.include(appRoles.ADMINISTRATOR) ? (
				<DashboardFrame title="List(s) of Users">
					<UserList />
				</DashboardFrame>
			) : (
				""
			)}
		</div>
	);
};

export default function User() {
	return <LoadUsers />;
}
