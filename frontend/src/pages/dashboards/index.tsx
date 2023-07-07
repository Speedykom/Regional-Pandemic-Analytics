import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/common/components/common/unauth";
import { DashboardList } from "@/modules/superset/views/List";
import secureLocalStorage from "react-secure-storage";

export const Dashboards = () => {
	const userRole: any = secureLocalStorage.getItem("user_role");
	const permits = userRole?.attributes;
	return (
		<DashboardFrame>
			{/* {permits?.Dashboard && permits?.Dashboard?.read ? <DashboardList /> : <Unauthorised />} */}
			<DashboardList />
		</DashboardFrame>
	);
};

export default function Dashboard() {
	return <Dashboards />;
}
