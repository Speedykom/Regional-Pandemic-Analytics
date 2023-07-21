import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { Unauthorized } from "@/common/components/common/unauth";
import { usePermission } from "@/common/hooks/use-permission";
import { UserDetails } from "@/modules/user/views/UserDetails";

export default function UserAdd() {
	const { hasPermission } = usePermission();
	return (
		<DashboardFrame>
			{hasPermission("user:read") ? <UserDetails /> : <Unauthorized />}
		</DashboardFrame>
	);
}
