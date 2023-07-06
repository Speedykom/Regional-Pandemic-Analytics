import { IGADTable } from "@/common/components/common/table";
import { Button, Form, Input, Modal } from "antd";
import { useRoles } from "../hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { IRole } from "../interface";
import secureLocalStorage from "react-secure-storage";
import { OpenNotification } from "@/common/utils/notify";
import { PlusOutlined, DeleteColumnOutlined, SaveOutlined } from "@ant-design/icons";
import getConfig from 'next/config'
import { useRouter } from "next/router";
 
const { publicRuntimeConfig } = getConfig()

enum OPERATION_TYPES {
	CREATE,
	UPDATE,
	NONE,
}

export const RoleList = () => {
	const router = useRouter();
	const del = () => {};
	const [form] = Form.useForm();

	const [token, setToken] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);

	const [data, setData] = useState<Array<IRole>>([]);

	const [roleId, setRoleId] = useState<string>();

	const fetchRoles = async () => {
		try {
			setLoading(true);
			const url = `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/role`;
			await axios
				.get(url, {
					headers: {
						"Content-Type": `application/json`,
					},
				})
				.then((res) => {
					setLoading(false);
					setData(res?.data);
				});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const refetch = () => {
		fetchRoles();
	};

	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 8 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 },
		},
	};

	const [open, setOpen] = useState(false);

	const edit = (id: string, name: string, description: string) => {
		setRoleId(id);
		setOpertaionType(OPERATION_TYPES.UPDATE);
		form.setFieldValue("name", name);
		form.setFieldValue("description", description);
		setOpen(true);
	};

	const view = (id: string) => {
		router.push(`/roles/${id}`);
	};

	const showModal = () => {
		setOpertaionType(OPERATION_TYPES.CREATE);
		setOpen(true);
	};

	const [operationType, setOpertaionType] = useState<OPERATION_TYPES>(
		OPERATION_TYPES.NONE
	);

	const onFinish = async (values: any) => {
		let url = `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/role`;
		url = operationType == OPERATION_TYPES.CREATE ? url : url + `/${roleId}`;
		let method = operationType == OPERATION_TYPES.CREATE ? "POST" : "PUT";

		await axios({
			url,
			method: method,
			data: values,
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				OpenNotification(res?.data?.message, "topRight", "success");
				form.resetFields();
				setOpen(false);
				refetch();
			})
			.catch((err) => {
				OpenNotification(err.response?.data, "topRight", "error");
			});
	};

	const handleCancel = () => {
		setOpen(false);
	};

	useEffect(() => {
		fetchRoles();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { columns } = useRoles({ edit, view, del, refetch });
	// @ts-ignore

	const userRole: any = secureLocalStorage.getItem("user_role");
	const permits = userRole?.attributes;
	return (
		<div className="">
			<nav>
				<div className="flex justify-between">
					<div>
						<h2 className="text-3xl">App Roles</h2>
						<p className="my-2 text-gray-600">
							View and manage settings related to app roles.
						</p>
					</div>
					{permits?.Role && permits?.Role?.create && (
						<div>
							<Button
								type="primary"
								size="large"
								icon={<PlusOutlined />}
								onClick={showModal}
							>
								New Role
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
						rows={data}
						columns={columns}
					/>
				</div>
			</section>
			<Modal
				open={open}
				title={
					operationType == OPERATION_TYPES.CREATE
						? "Create Role"
						: operationType == OPERATION_TYPES.UPDATE && "Update Role"
				}
				onCancel={handleCancel}
				footer={
					<Form form={form} onFinish={onFinish}>
						<Form.Item>
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
									style={{
										backgroundColor: "#087757",
										border: "1px solid #e65e01",
									}}
									htmlType="submit"
								>
									{operationType == OPERATION_TYPES.CREATE
										? "Save Role"
										: operationType == OPERATION_TYPES.UPDATE && "Save Changes"}
								</Button>
							</div>
						</Form.Item>
					</Form>
				}
			>
				<Form
					{...formItemLayout}
					form={form}
					name="register"
					onFinish={onFinish}
					scrollToFirstError
					size="large"
					className="w-full"
				>
					<Form.Item
						name="name"
						label="Role Name"
						className="w-full"
						rules={[
							{
								required: true,
								message: "Please input role name",
							},
						]}
					>
						<Input className="w-full" />
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
						rules={[
							{
								required: true,
								message: "Please input role description",
							},
						]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};
