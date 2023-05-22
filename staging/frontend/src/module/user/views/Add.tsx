import { SaveOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";

interface props {
	openDrawer: boolean;
	closeDrawer: () => void;
}

export const AddUser = ({ openDrawer, closeDrawer }: props) => {
	return (
		<Drawer
            title={"Create a user"}
            size={"large"}
			placement={"right"}
			closable={true}
			className="border-2"
			destroyOnClose={true}
			open={openDrawer}
			onClose={closeDrawer}
			footer={
				<div className="flex justify-end space-x-3 py-3 px-4">
					<button
						className="focus:outline-none px-8 py-2 text-gray-700 font-medium"
						style={{
							backgroundColor: "#48328526",
						}}
						type="submit"
					>
						Cancel
					</button>
					<Button
							type="primary"
							className="flex items-center"
							icon={<SaveOutlined />}
							style={{
								backgroundColor: "#087757",
								border: "1px solid #e65e01",
                            }}
						>
							New User
						</Button>
				</div>
			}
		></Drawer>
	);
};
