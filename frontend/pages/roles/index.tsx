import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/components/common/unauth";
import { RoleList } from "@/src/modules/roles/views/List";
import { appRoles, role } from "@/utils/auth";
import secureLocalStorage from "react-secure-storage";

export const LoadRoles = () => {
	const userRole: any = secureLocalStorage.getItem("user_role");
	const permits = userRole?.attributes;
	return (
		<DashboardFrame>
			{permits?.Role && permits?.Role?.read ? <RoleList /> : <Unauthorised />}
		</DashboardFrame>
	);
};

export default function Role() {
	return <LoadRoles />;
}
