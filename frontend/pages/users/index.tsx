import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/components/common/unauth";
import { appRoles, role } from "@/utils/auth";
import { UserList } from "@/src/modules/user/views/List";

export const LoadUsers = () => {
	const check: boolean = role?.includes(appRoles.ADMINISTRATOR);
	return (
		<DashboardFrame>
			{check ? <UserList /> : <Unauthorised />}
		</DashboardFrame>
	);
};

export default function User() {
	return <LoadUsers />;
}
