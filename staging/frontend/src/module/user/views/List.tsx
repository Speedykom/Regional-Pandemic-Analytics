import { IGADTable } from "@/components/common/table"
import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useUsers } from "../hooks";
import { IUser } from "../interface";

export const UserList = () => {
    const { rows, columns, loading } = useUsers();
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
									backgroundColor: "#e65e01",
                                    border: "1px solid #e65e01",
								}}
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
							onRow={(record: IUser) => ({
								onClick: () => alert(`Hello, ${record.firstName}`),
							})}
							columns={columns}
						/>
					</div>
				</section>
			</div>
    )
}