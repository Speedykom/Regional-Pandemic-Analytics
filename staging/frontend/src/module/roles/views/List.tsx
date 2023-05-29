import { IGADTable } from "@/components/common/table";
import {
	DeleteColumnOutlined,
	PlusOutlined,
	SaveOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Switch } from "antd";
import { useRoles } from "../hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { getData } from "@/utils";
import { IRoles } from "../interface";
import { OpenNotification } from "@/utils/notify";

interface props {
	viewPro: () => void;
}

enum OPERATION_TYPES {
	CREATE,
	UPDATE,
	NONE
}

export const RoleList = () => {
	const del = () => {};
	const [form] = Form.useForm();

	const [token, setToken] = useState<string>("");

	const fetchToken = async () => {
		try {
			const url = "/api/get-access-token/";
			const response = await getData(url);
			setToken(response?.accessToken);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const [data, setData] = useState<Array<IRoles>>([]);

	const [view, setView] = useState<boolean>(false);
	const [roleId, setRoleId] = useState<string>();

	const fetchRoles = async () => {
		try {
			const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/account/roles`;
			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setData(response?.data);
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
		setRoleId(id)
		setOpertaionType(OPERATION_TYPES.UPDATE)
		form.setFieldValue("name", name)
		form.setFieldValue("description", description)
		setOpen(true);
	};

	const showModal = () => {
		setOpertaionType(OPERATION_TYPES.CREATE)
		setOpen(true);
	};

	const [operationType, setOpertaionType] = useState<OPERATION_TYPES>(OPERATION_TYPES.NONE)

	const onFinish = async (values: any) => {
		let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/account/roles`
		url = operationType == OPERATION_TYPES.CREATE ? url + "/create" : url + `/${roleId}/update`
		await axios
			.post(
				url,
				values,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				setOpen(false);
				refetch();
				OpenNotification(res.data?.message, "topRight", "success");
				form.resetFields()
			})
			.catch((err) => {
				OpenNotification(err.response?.data, "topRight", "error");
			});
	};

	const handleCancel = () => {
		setOpen(false);
	};

	useEffect(() => {
		fetchToken();
		fetchRoles();
	}, []);

	const { columns, loading } = useRoles({ edit, del, refetch });
	// @ts-ignore
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
					<div>
						<Button
							type="primary"
							className="flex items-center"
							icon={<PlusOutlined />}
							style={{
								backgroundColor: "#087757",
								border: "1px solid #e65e01",
							}}
							onClick={showModal}
						>
							New Role
						</Button>
					</div>
				</div>
			</nav>
			<section className="mt-5">
				<div className="py-2">
					<IGADTable
						key={"id"}
						loading={loading}
						// @ts-ignore
						rows={data}
						columns={columns}
					/>
				</div>
			</section>
			<Modal
				open={open}
				title={operationType == OPERATION_TYPES.CREATE ? "Create Role" : operationType == OPERATION_TYPES.UPDATE && "Update Role"}
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
									{operationType == OPERATION_TYPES.CREATE ? "Save Role" : operationType == OPERATION_TYPES.UPDATE && "Save Changes"}
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
