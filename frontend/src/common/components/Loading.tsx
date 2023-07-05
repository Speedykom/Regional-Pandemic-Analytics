import { Loader } from "./Loader";

export const Loading = () => {
	return (
		<div className="h-screen flex items-center justify-center">
			<div className="flex justify-center flex-col space-y-5 items-center">
				<div className="w-20 h-20">
					<Loader />
				</div>
				<p>Loading . . . .</p>
			</div>
		</div>
	);
};
