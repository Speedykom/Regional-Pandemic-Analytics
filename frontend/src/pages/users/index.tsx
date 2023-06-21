import { Unauthorised } from "@/common/components/common/unauth";
import Layout from "@/common/components/layout";
import { UserList } from "@/modules/user/views/List";
import secureLocalStorage from "react-secure-storage";

export const LoadUsers = () => {
	const userRole: any = secureLocalStorage.getItem("user_role");
	const permits = userRole?.attributes;
	return (
		<Layout title="Users">
			{permits?.Role && permits?.Role?.read ? <UserList /> : <Unauthorised />}
		</Layout>
	);
};

export default function User() {
	return <LoadUsers />;
}
