import { DeleteColumnOutlined, SaveOutlined } from "@ant-design/icons";
import {
	Button,
	Drawer,
	Form,
	Input,
	InputNumber,
	Radio,
	RadioChangeEvent,
	Select,
	SelectProps,
	Switch,
} from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { IAttribute } from "../interface";
import { useEffect, useState } from "react";

interface props {
	openDrawer: boolean;
	closeDrawer: () => void;
    attributes: Array<IAttribute>;
}

export const EditPermission = ({ openDrawer, closeDrawer, attributes }: props) => {
    const [loading, setLoading] = useState(true);
    const [attribs, setAttribs] = useState<IAttribute[]>([]);

    const [form] = Form.useForm();

    
    
    useEffect(() => {
        setAttribs(attribs);
    }, []);

	return (
		<Drawer
			title={"Edit Permission"}
			size="large"
			placement={"right"}
			closable={true}
			className="border-2"
			destroyOnClose={true}
			open={openDrawer}
			onClose={closeDrawer}
			width={700}
			footer={
				<div className="flex justify-end space-x-3 py-3 px-4">
					<Form form={form}>
						<Form.Item>
							<div className="flex space-x-2">
								<Button
									className="focus:outline-none px-6 py-2 text-gray-700 font-medium flex items-center"
									style={{
										backgroundColor: "#48328526",
										border: "1px solid #48328526",
									}}
									type="primary"
									size="large"
									icon={<DeleteColumnOutlined />}
									onClick={() => {
										form.resetFields();
										closeDrawer();
									}}
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
									size="large"
									htmlType="submit"
								>
									Make Changes
								</Button>
							</div>
						</Form.Item>
					</Form>
				</div>
			}
		>
            <section className="mt-5">
				<div className="bg-white py-5 rounded-md px-5">
					<div className="flex"></div>
					<ul className="space-y-10">
						<div className="flex justify-between border-b-2">
							<div>
								<p>Permissions</p>
							</div>
							<div className="flex justify-between space-x-20">
								<p>Create</p>
								<p>Read</p>
								<p>Update</p>
								<p>Delete</p>
							</div>
						</div>
						{attributes.map((value, index) => (
							<li key={index} className="flex justify-between">
								<div>
									<p>{value?.key}</p>
								</div>
								<div className="flex items-start space-x-28">
									<input
										type="checkbox"
										value={String(value?.value.create)}
										checked={value?.value.create}
									/>
									<input
										type="checkbox"
										value={String(value?.value.read)}
										checked={value?.value.read}
									/>
									<input
										type="checkbox"
										value={String(value?.value.update)}
										checked={value?.value.update}
									/>
									<input
										type="checkbox"
										value={String(value?.value.delete)}
                                        checked={value?.value.delete}
									/>
								</div>
							</li>
						))}
					</ul>
                </div>
                <div>
			</div>
                {/* <div className="py-2">
					<IGADTable
						key={"id"}
						loading={loading}
						rows={attributes}
						columns={columns}
					/>
				</div> */}
			</section>
		</Drawer>
	);
};
