import { Input } from "antd";
import { useRouter } from "next/router";

export const ResetPassword = () => {
	const router = useRouter()
	return (
		<div className="max-w-4xl mx-auto mt-24 w-full h-full">
			<div className="flex flex-col items-center justify-center p-4 space-y-4 antialiased text-gray-900">
				<div>
					<img src="/images/igad_logo.jpg" alt="igad logo" />
				</div>
				<div className="w-full px-8 max-w-lg space-y-6 bg-gray-300 rounded-md py-16">
					<h1 className=" mb-6 text-3xl font-bold text-center">Don't worry</h1>
					<p className="mx-12 items-start">
						We are here to help you recover your password. Enter the email
						address associated with your account and we'll send you a link to
						reset your password.
					</p>
					<form action="#" className="space-y-6 w-ful">
						<div>
							<label htmlFor="email" className="test-base pl-1 mb-2">Email</label>
							<Input type="email" autoComplete="true" size="large" placeholder="Email address" required />
						</div>
						<div>
							<button
								type="submit"
								className="w-full px-4 py-2 font-medium text-center text-white bg-indigo-600 transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
							>
								Continue
							</button>
						</div>
					</form>
					<div className="text-sm text-gray-600 items-center flex justify-between">
						<p className="text-gray-800 cursor-pointer hover:text-blue-500 inline-flex items-center ml-4" onClick={() => router.push("/")}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
									clip-rule="evenodd"
								/>
							</svg>
							Back
						</p>
						<p className="hover:text-blue-500 cursor-pointer">Need help?</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function ResetLayout() {
	return <ResetPassword />;
}
