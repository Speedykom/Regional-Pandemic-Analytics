import { IGADTable } from "@/components/common/table";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useUsers } from "../hooks";
import { IUser } from "../interface";
import { useState } from "react";
import { AddUser } from "./Add";

export const UserList = () => {
	const edit = () => {};
	const del = () => {};
	const view = () => {};
	const [open, setOpen] = useState<boolean>(false);
	const onClose = () => {
		setOpen(false);
	};

	// openDrawer={open}
	// 				closeDrawer={onClose}
	const { rows, columns, loading } = useUsers({ edit, del, view });
	return (
		<div className="">
			<nav>
				<div className="flex justify-between">
					<div>
						<h2 className="text-3xl">App Accounts</h2>
						<p className="my-2 text-gray-600">
							View and manage settings related to app users.
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
                            onClick={((e) => {
                                e.preventDefault()
                                setOpen(true)
                            }) }
						>
							New User
						</Button>
					</div>
				</div>
			</nav>
			<section className="mt-5">
				<div className="py-2">
					<IGADTable
						key={"id"}
						loading={loading}
						rows={rows}
						columns={columns}
					/>
				</div>
            </section>
            <div>
                <AddUser openDrawer={open} closeDrawer={onClose} />
            </div>
		</div>
	);
};
