import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Button } from "@tremor/react";
import { useRouter } from "next/router";
import { useGetPipelineQuery } from "../pipeline";

interface HopUIProps {
	id: string;
}

export const HopUI = ({ id }: HopUIProps) => {
	const { data } = useGetPipelineQuery(id);
	const router = useRouter();
	return (
		<div className="">
			<nav className="mb-5 flex justify-between items-center">
				<div>
					<h2 className="text-3xl">Pipeline : {data?.name}</h2>
					<p className="my-2 text-gray-600">{data?.description}</p>
				</div>
				<div>
					<Button
						icon={ChevronLeftIcon}
						onClick={() => router.push(`/pipelines`)}
						className="bg-prim hover:bg-prim-hover border-0"
					>
						My Pipelines
					</Button>
				</div>
			</nav>
			<div>		
				<iframe src="/hop/ui" className="w-full h-screen"></iframe>
			</div>
		</div>
	);
};
