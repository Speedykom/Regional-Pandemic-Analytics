import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/components/common/unauth";
import { UserList } from "@/src/modules/user/views/List";
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
