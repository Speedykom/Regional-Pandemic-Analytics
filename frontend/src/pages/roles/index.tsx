import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/common/components/common/unauth";
import { RoleList } from "@/modules/roles/views/List";
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
