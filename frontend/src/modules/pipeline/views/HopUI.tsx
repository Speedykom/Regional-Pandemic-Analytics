import { useGetPipelineQuery } from "../pipeline";

interface HopUIProps {
	id: string;
}

export const HopUI = ({ id }: HopUIProps) => {
	const { data } = useGetPipelineQuery(id);
	return (
		<div className="">
			<nav className="mb-5 flex justify-between items-center">
				<div>
					<h2 className="text-3xl">Pipeline : {data?.name}</h2>
					<p className="my-2 text-gray-600">{data?.description}</p>
				</div>
			</nav>
			<div>		
				<iframe src="/hop/ui" className="w-full h-screen"></iframe>
			</div>
		</div>
	);
};
