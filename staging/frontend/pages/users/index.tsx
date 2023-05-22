import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { IGADTable } from "@/components/common/table";
import { useUsers } from "@/src/module/user/hooks";
import { IUser } from "@/src/module/user/interface";
import { UserList } from "@/src/module/user/views/List";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Menu } from "antd";

export const LoadUsers = () => {
	return (
		<DashboardFrame title="List(s) of Users">
			<UserList />
		</DashboardFrame>
	);
};

export default function User() {
	return <LoadUsers />;
}
