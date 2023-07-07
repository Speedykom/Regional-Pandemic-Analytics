import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { IGADTable } from "@/common/components/common/table";
import { BASE_URL } from "@/common/config";
import { OpenNotification } from "@/common/utils/notify";
import { useAttributes } from "@/modules/roles/hooks";
import { IAttribute, IRoles } from "@/modules/roles/interface";
import {
	DeleteColumnOutlined,
	EditOutlined,
	SaveOutlined,
} from "@ant-design/icons";
import { Button, Form, Modal, Switch } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export const ViewRole = () => {
	const userRole: any = secureLocalStorage.getItem("user_role");
	const permits = userRole?.attributes;
	const roleId = location.href.substring(location.href.lastIndexOf("/") + 1);
	const [role, setRole] = useState<IRoles>();
	const [attributes, setAttributes] = useState<IAttribute[]>([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [onSaveLoad, setOnSaveLoad] = useState(false);
	const [open, setOpen] = useState<boolean>(false);

	const tokens: any = secureLocalStorage.getItem("tokens") as object;
	const accessToken = tokens && 'accessToken' in tokens ? tokens.accessToken : '' 

	const fetchRole = async () => {
		setLoading(true);
		await axios
			.get(`${BASE_URL}/api/role/${roleId}?type=id`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.then((res) => {
				setLoading(false);
				setRole(res.data?.role);
				const attribs: any = Object.entries(res.data.role.attributes).map(
					([key, value]) => {
						// console.log({key, value})
						if (value instanceof Array) {
							return {
								key,
								value: JSON.parse(value[0]),
							};
						}
					}
				);
				setAttributes(attribs);
			})
			.catch((err) => {
				setError(err?.response?.data);
			});
	};

	const [form] = Form.useForm();

	const [key, setKey] = useState<string>();
	const [value, setValue] = useState<any>();

	const edit = (attribute: IAttribute) => {
		setKey(attribute.key);
		setValue(attribute.value);
		setOpen(true);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const { columns } = useAttributes({ edit });

	const triggerCreate = (checked: boolean) => {
		setValue({
			create: checked,
			read: value.read,
			update: value.update,
			delete: value.delete,
		});
	};

	const triggerRead = (checked: boolean) => {
		setValue({
			create: value.create,
			read: checked,
			update: value.update,
			delete: value.delete,
		});
	};

	const triggerUpdate = (checked: boolean) => {
		setValue({
			create: value.create,
			read: value.read,
			update: checked,
			delete: value.delete,
		});
	};

	const triggerDelete = (checked: boolean) => {
		setValue({
			create: value.create,
			read: value.read,
			update: value.update,
			delete: checked,
		});
	};

	const refetch = () => {
		fetchRole();
	};

	const onFinish = async () => {
		setOnSaveLoad(true)
		const roleId = location.href.substring(location.href.lastIndexOf('/') + 1);
		await axios.put(`${BASE_URL}/api/role/${roleId}/permission`, {
			key,
			value
		}, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}).then((res) => {
			setOnSaveLoad(false)
			OpenNotification(res?.data?.message, "topRight", "success");
			form.resetFields();
			setOpen(false);
			refetch();
		})
		.catch((err) => {
			OpenNotification(err.response?.data, "topRight", "error");
		});
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
				<Modal
					open={open}
					title={`${key} permission update`}
					onCancel={handleCancel}
					footer={
						<div className="flex space-x-2 justify-end">
							<Button
								className="focus:outline-none px-6 py-2 text-gray-700 font-medium flex items-center"
								style={{
									backgroundColor: "#48328526",
									border: "1px solid #48328526",
								}}
								type="primary"
								icon={<DeleteColumnOutlined />}
								onClick={handleCancel}
							>
								Cancel
							</Button>
							<Button
								type="primary"
								className="flex items-center"
								icon={<SaveOutlined />}
								loading={onSaveLoad}
								style={{
									backgroundColor: "#087757",
									border: "1px solid #e65e01",
								}}
								onClick={onFinish}
							>
								"Save Changes"
							</Button>
						</div>
					}
				>
					<Form
						form={form}
						name="permission"
						scrollToFirstError
						size="large"
						className="w-full"
					>
						<Form.Item
							name="create"
							label="Create"
							className="w-full"
							rules={[
								{
									required: true,
									message: "Please input role name",
								},
							]}
						>
							<Switch
								checked={Boolean(value?.create)}
								id="create"
								onChange={triggerCreate}
								style={{
									backgroundColor: !value?.create
										? "#8c8c8c"
										: "cornflowerblue",
								}}
							/>
						</Form.Item>
						<Form.Item
							name="read"
							label="Read"
							rules={[
								{
									required: true,
									message: "Please input role description",
								},
							]}
						>
							<Switch
								checked={Boolean(value?.read)}
								id="read"
								onChange={triggerRead}
								style={{
									backgroundColor: !value?.read ? "#8c8c8c" : "cornflowerblue",
								}}
							/>
						</Form.Item>
						<Form.Item
							name="update"
							label="Update"
							rules={[
								{
									required: true,
									message: "Please input role description",
								},
							]}
						>
							<Switch
								checked={Boolean(value?.update)}
								id="update"
								onChange={triggerUpdate}
								style={{
									backgroundColor: !value?.update
										? "#8c8c8c"
										: "cornflowerblue",
								}}
							/>
						</Form.Item>
						<Form.Item
							name="delete"
							label="Delete"
							rules={[
								{
									required: true,
									message: "Please input role description",
								},
							]}
						>
							<Switch
								checked={Boolean(value?.delete)}
								id="delete"
								onChange={triggerDelete}
								style={{
									backgroundColor: !value?.delete
										? "#8c8c8c"
										: "cornflowerblue",
								}}
							/>
						</Form.Item>
					</Form>
				</Modal>
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
