import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@tremor/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useGetPipelineQuery, useUpdatePipelineMutation } from "../pipeline";

interface HopUIProps {
	name: string;
}

export const HopUI = ({ name }: HopUIProps) => {
	const { data } = useGetPipelineQuery(name);
	const [updatePipeline] = useUpdatePipelineMutation();

	const savePipeline = () => {
		updatePipeline(name)
			.then((data: any) => {
				if (data.status === "success") {
					navigateToPipelines().then(() => {
						toast.success("Pipeline updated successfully", { position: "top-right" });
					})
				} else {
					return Promise.reject(data)
				}
			}).catch(() => {
				navigateToPipelines().then(() => {
					toast.error("Unable to update pipeline", { position: "top-right" });
				})
			})
	}

	const navigateToPipelines = () => {
		return router.push(`/pipelines`)
	}

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
						icon={XMarkIcon}
						onClick={navigateToPipelines}
						className="bg-gray-400 hover:bg-gray-400-hover border-0 mx-1"
					>
						Cancel
					</Button>
					<Button
						icon={CheckCircleIcon}
						onClick={savePipeline}
						className="bg-prim hover:bg-prim-hover border-0 mx-1"
					>
						Save
					</Button>
				</div>
			</nav>
			<div>		
				<iframe src="/hop/ui" className="w-full h-screen"></iframe>
			</div>
		</div>
	);
};
