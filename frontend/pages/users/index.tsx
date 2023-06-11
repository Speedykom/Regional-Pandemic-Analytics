import DashboardFrame from "@/src/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/src/components/common/unauth";
import { appRoles, roles } from "@/utils/auth";
import { UserList } from "@/src/modules/user/views/List";

export const LoadUsers = () => {
	const check: boolean = roles?.includes(appRoles.ADMINISTRATOR);
	return (
		<DashboardFrame>
			{check ? <UserList /> : <Unauthorised />}
		</DashboardFrame>
	);
};

export default function User() {
	return <LoadUsers />;
}
