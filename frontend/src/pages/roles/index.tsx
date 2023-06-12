import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/common/components/common/unauth";
import { appRoles, roles } from "@/common/utils/auth";
import { RoleList } from "@/modules/roles/views/List";

export const LoadRoles = () => {
	const check: boolean = roles?.includes(appRoles.ADMINISTRATOR);
	return (
		<DashboardFrame>
			{check ? <RoleList /> : <Unauthorised />}
		</DashboardFrame>
	);
};

export default function Role() {
	return <LoadRoles />;
}
