import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/common/components/common/unauth";
import { UserList } from "@/modules/user/views/List";
import secureLocalStorage from "react-secure-storage";

export const LoadUsers = () => {
	const userRole: any = secureLocalStorage.getItem("user_role");
	const permits = userRole?.attributes;
	return (
		<DashboardFrame>
			{permits?.Role && permits?.Role?.read ? <UserList /> : <Unauthorised />}
		</DashboardFrame>
	);
};

export default function User() {
	return <LoadUsers />;
}
