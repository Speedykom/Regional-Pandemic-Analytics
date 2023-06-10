import { OpenNotification } from "@/utils/notify";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useRouter } from "next/router";

export const ResetPassword = () => {
	const router = useRouter();
	const [form] = Form.useForm();
	const onFinish = async (values: any) => {
		console.log({ values });
		await axios
			.post(
				`${process.env.NEXT_PUBLIC_BASE_URL}/api/account/user/reset/password-request`,
				values,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				OpenNotification(res.data?.message, "topRight", "success");
				router.push("/");
			})
			.catch((err) => {
				OpenNotification(err.response?.data?.errorMessage, "topRight", "error");
			});
	};

	return (
		<div className="grid h-screen container mx-auto w-full">
			<div className="flex flex-col items-center justify-center px-6 my-12">
				<div className="w-full xl:w-3/4 lg:w-11/12 flex">
					<div
						className="w-full h-auto bg-white hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
						style={{
							backgroundImage: "url('/images/lock5.png')",
						}}
					></div>
					<div className="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
						<div className="px-8 mb-4 text-center">
							<h3 className="pt-4 mb-2 text-2xl">Forgot Your Password?</h3>
							<p className="mb-4 text-sm text-gray-700">
								We get it, stuff happens. Just enter your email address below
								and we'll send you a link to reset your password!
							</p>
						</div>
						<Form
							form={form}
							onFinish={onFinish}
							className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
						>
							<div className="mb-4">
								<label
									className="block mb-2 text-sm font-bold text-gray-700"
									htmlFor="email"
								>
									Email
								</label>
								<Form.Item
									name="email"
									rules={[
										{
											type: "email",
											message: "The input is not valid E-mail!",
										},
										{
											required: true,
											message: "Please input your E-mail!",
										},
									]}
								>
									<Input
										className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
										id="email"
										type="email"
										size="large"
										placeholder="Enter Email Address..."
									/>
								</Form.Item>
							</div>
							<div className="mb-6 text-center">
								<Form.Item>
									<Button
										className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
										htmlType="submit"
										size="large"
									>
										Reset Password
									</Button>
								</Form.Item>
							</div>
							<hr className="mb-6 border-t" />
							<div className="text-center">
								<Form.Item>
									<p>
										Remember your password?{" "}
										<Button
											type="link"
											className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
											onClick={() => router.push("/")}
										>
											Login here!
										</Button>
									</p>
								</Form.Item>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function ResetLayout() {
	return <ResetPassword />;
}
