import { Unauthorized } from "@/common/components/common/unauth";
import Layout from "@/common/components/Dashboard/Layout";
import { usePermission } from "@/common/hooks/use-permission";
import { HopUI } from "@/modules/pipeline/views/HopUI";
import { useRouter } from "next/router";

export default function Pipeline() {
	const router = useRouter();
	const { hasPermission } = usePermission();
	const { id } = router.query as { id: string };
	return (
		<Layout>
			{hasPermission("pipeline:read") && id ? <HopUI id={id} /> : <Unauthorized />}
		</Layout>
	);
}
