import { Unauthorized } from "@/common/components/common/unauth";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { usePermission } from "@/common/hooks/use-permission";
import { HopUI } from "@/modules/pipeline/views/HopUI";
import { useRouter } from "next/router";

export default function Pipeline() {
	const router = useRouter();
	const { hasPermission } = usePermission();
	const { id } = router.query as { id: string };
	return (
		<DashboardFrame title="My Pipeline">
			{hasPermission("pipeline:read") && id ? <HopUI id={id} /> : <Unauthorized />}
		</DashboardFrame>
	);
}
