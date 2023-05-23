import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { UserList } from "@/src/module/user/views/List";
import { getData } from "@/utils";
import { useState } from "react";

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
