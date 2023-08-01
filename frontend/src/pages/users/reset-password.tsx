import { useRouter } from "next/router";
import { Button, TextInput } from "@tremor/react";
import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "@/modules/user/user";
import { toast } from "react-toastify";
import { ResetRequest } from "@/modules/user/interface";

export const ResetPassword = () => {
	const router = useRouter();
	const [restPassword, { isLoading, error }] = useResetPasswordMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetRequest>();

	const onFinish = async (data: ResetRequest) => {
		restPassword(data)
			.unwrap()
			.then((payload) => {
				toast.success(payload.message, {
					position: "top-center",
					delay: 200,
				});
				router.push("/");
			})
			.catch((error) => {
				toast.error(error?.data?.errorMessage, {
					position: "top-center",
					delay: 300,
				});
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
						<form
							onSubmit={handleSubmit((data) => onFinish(data))}
							className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
						>
							<div className="mb-4">
								<label
									className="block mb-2 text-sm font-bold text-gray-700"
									htmlFor="email"
								>
									Email*
								</label>
								<TextInput
									{...register("email", {
										required: true,
									})}
									error={errors.email ? true : false}
									errorMessage={
										errors.email ? "Please input a valid email" : ""
									}
									className="w-full px-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="email"
									type="email"
									placeholder="Enter Email Address..."
								/>
							</div>
							<div className="mb-6 text-center">
								<Button
									className="w-full px-4 py-2 border-0 font-bold text-white bg-red-500 rounded-full hover:bg-green-700 focus:outline-none focus:shadow-outline"
									type="submit"
									size="lg"
									loading={isLoading}
								>
									Reset Password
								</Button>
							</div>
							<hr className="mb-6 border-t" />
							<div className="text-center">
								<p>
									Remember your password?{" "}
									<Button
										variant="light"
										className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 shadow-none border-0"
										onClick={() => router.push("/")}
									>
										Login here!
									</Button>
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function ResetLayout() {
	return <ResetPassword />;
}
