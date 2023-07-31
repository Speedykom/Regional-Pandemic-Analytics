import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { Unauthorized } from "@/common/components/common/unauth";
import { usePermission } from "@/common/hooks/use-permission";
import { RoleList } from "@/modules/roles/views/List";

export const LoadRoles = () => {
	const { hasPermission } = usePermission();
	return (
		<DashboardFrame>
			{hasPermission('user:read') ? <RoleList /> : <Unauthorized />}
		</DashboardFrame>
	);
};

export default function Role() {
	return <LoadRoles />;
}
