import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { IGADTable } from "@/common/components/common/table";
import { BASE_URL } from "@/common/config";
import { useAttributes } from "@/modules/roles/hooks";
import { IAttribute, IRole } from "@/modules/roles/interface";
import { EditPermission } from "@/modules/roles/views/EditPermission";
import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export const ViewRole = () => {
	const userRole: any = secureLocalStorage.getItem("user_role");
	const permits = userRole?.attributes;
	const roleId = location.href.substring(location.href.lastIndexOf("/") + 1);
	const [role, setRole] = useState<IRole>();
	const [attributes, setAttributes] = useState<IAttribute[]>([]);
	const [error, setError] = useState(null);
	const [disable, setDisable] = useState(true);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState<boolean>(false);
	const { columns } = useAttributes();
	const fetchRole = async () => {
		setLoading(true);
		await axios
			.get(`${BASE_URL}/api/role/${roleId}?type=id`)
			.then((res) => {
				setLoading(false);
				setRole(res.data?.role);
				const attribs: any = Object.entries(res.data.role.attributes).map(
					([key, value]) => {
						// console.log({key, value})
						return {
							key,
							value: JSON.parse(value[0]),
						};
					}
				);
				setAttributes(attribs);
			})
			.catch((err) => {
				setError(err?.response?.data);
			});
	};

	const onClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		fetchRole();
	}, []);
	return (
		<div>
			<nav>
				<div className="flex justify-between">
					<div>
						<h2 className="text-3xl">{role?.name}</h2>
						<p className="my-2 text-gray-600">{role?.description}</p>
					</div>
					{permits?.Role && permits?.Role?.update && (
						<div>
							<Button
								type="primary"
								size="large"
								icon={<EditOutlined />}
								onClick={(e) => {
									e.preventDefault();
									setOpen(true);
								}}
							>
								Edit Permissions
							</Button>
						</div>
					)}
				</div>
			</nav>
			<section className="mt-5">
				<div className="py-2">
					<IGADTable
						key={"id"}
						loading={loading}
						rows={attributes}
						columns={columns}
					/>
				</div>
				<div>
					<EditPermission
						openDrawer={open}
						closeDrawer={onClose}
						attributes={attributes}
					/>
				</div>
			</section>
		</div>
	);
};

export default function RoleView() {
	return (
		<DashboardFrame>
			<ViewRole />
		</DashboardFrame>
	);
}
