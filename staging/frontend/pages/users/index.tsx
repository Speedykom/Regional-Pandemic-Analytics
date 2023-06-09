import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/components/common/unauth";
import { UserList } from "@/src/module/user/views/List";
import { appRoles, roles } from "@/utils/auth";

export const LoadUsers = () => {
	const check: boolean = roles?.includes(appRoles.ADMINISTRATOR);
	return (
		<DashboardFrame title={check ? "List(s) of Users" : "Missing Permissions"}>
			{check ? <UserList /> : <Unauthorised />}
		</DashboardFrame>
	);
};

export default function User() {
	return <LoadUsers />;
}
