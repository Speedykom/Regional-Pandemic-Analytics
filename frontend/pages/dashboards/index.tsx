import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/components/common/unauth";
import { DashboardList } from "@/src/modules/superset/views/List";
import secureLocalStorage from "react-secure-storage";

export const Dashboards = () => {
	const userRole: any = secureLocalStorage.getItem("user_role");
	const permits = userRole?.attributes;
	return (
		<DashboardFrame>
			{permits?.Dashboard && permits?.Dashboard?.read ? <DashboardList /> : <Unauthorised />}
		</DashboardFrame>
	);
};

export default function Dashboard() {
	return <Dashboards />;
}
