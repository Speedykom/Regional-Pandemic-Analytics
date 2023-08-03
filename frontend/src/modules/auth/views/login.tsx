import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import secureLocalStorage from "react-secure-storage";
import { setCredentials, useLoginMutation } from "../auth";
import { useDispatch } from "react-redux";
import { Button, TextInput } from "@tremor/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { LoginParams } from "../interface";

export default function LoginForm() {
	const [login, { isLoading }] = useLoginMutation();
	const router = useRouter();
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginParams>();

	const onFinish = (data: LoginParams) => {
		login(data)
			.unwrap()
			.then((payload) => {
				dispatch(
					setCredentials({
						permissions: payload.permissions,
						accessToken: payload.access_token,
						refreshToken: payload.refresh_token,
					})
				);

				// @todo : we seek a better way to handle this
				secureLocalStorage.setItem(
					"passcode",
					Buffer.from(data.password).toString("base64")
				);

				router.push("/home");
			})
      .catch((error: any) => {
				toast.error("Wrong username or password!", {
					delay: 200,
					position: "top-right",
				});
			});
	};

	return (
		<>
			<Head>
				<title>Regional Pandemic Analytics Tool | Login</title>
			</Head>
			<section className="gradient-form md:h-screen">
				<div className="container mx-auto px-6" style={{ marginTop: "10vh" }}>
					<div className="flex justify-center items-center flex-wrap g-6 text-gray-800">
						<div className="xl:w-10/12">
							<div className="block bg-white shadow-lg rounded-lg">
								<div className="lg:flex lg:flex-wrap g-0">
									<div className="lg:w-6/12 px-4 md:px-0">
										<div className="md:p-12 md:mx-6">
											<div className="text-center">
												<Image
													className="mx-auto w-72"
													src="/images/igad_logo.jpg"
													alt="logo"
													width={500}
													height={200}
												/>
											</div>
											<form
												name="login-user"
												onSubmit={handleSubmit((data: any) => onFinish(data))}
												className="px-8"
											>
												<div className="relative w-full mb-3">
													<label
														className="block text-gray-600 text-xs mb-2"
														htmlFor="username"
													>
														Username or Email*
													</label>
													<TextInput
														{...register("username", {
															required: true,
														})}
														error={errors.username ? true : false}
														errorMessage={
															errors.username
																? "Please input your username or email"
																: ""
														}
														type="text"
														className="bg-white"
													/>
												</div>
												<div className="relative w-full mb-3">
													<label
														className="block text-gray-600 text-xs mb-2"
														htmlFor="password"
													>
														Password*
													</label>
													<TextInput
														{...register("password", {
															required: true,
														})}
														error={errors.password ? true : false}
														errorMessage={
															errors.password
																? "Please input your password"
																: ""
														}
														type="password"
														className="bg-white"
													/>
												</div>
												<div className="w-full flex flex-col mb-3 pt-2 md:flex-row md:justify-between">
													<div className="w-full md:w-1/2 md:mb-0 flex items-center space-x-2">
														<input type="checkbox" />
														<span>Remember Me</span>
													</div>
													<div className="w-full md:w-auto">
														<a
															onClick={() =>
																router.push("/users/reset-password")
															}
															className="hover:text-indigo-300 cursor-pointer"
														>
															Forgot password
														</a>
													</div>
												</div>
												<div className="mb-5">
													<Button
														type="submit"
														loading={isLoading}
														className="w-full bg-prim hover:bg-prim-hover text-white rounded-md border-0 hover:bg-green-700"
														size="lg"
													>
														Login
													</Button>
												</div>
											</form>
										</div>
									</div>
									<div className="bg-prim lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none">
										<div className="text-white px-4 py-6 md:p-12 md:mx-6">
											<h4 className="text-2xl font-semibold mb-4">
												Welcome back!
											</h4>
											<p className="text-sm">
												Simply login to access the IGAD regional pandemic
												analytics tool to collect, analyze, and report granular
												and aggregated data from multiple sources for informed
												decision-making.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
