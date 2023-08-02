import { useState } from "react";
import { useCreatePipelineMutation } from "../pipeline";
import Drawer from "@/common/components/common/Drawer";
import { Button, TextInput } from "@tremor/react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

interface AddPipelineProps {
	state: boolean;
	onClose: () => void;
  template: any;
  refetch: () => void;
}

export const AddPipeline = ({ state, onClose, template, refetch }: AddPipelineProps) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const [addPipeline, { isLoading }] = useCreatePipelineMutation();

	const onFinish = (value: any) => {
		addPipeline({ ...value, path: template?.path }).then((res: any) => {
			if (res.error) {
				const { data } = res.error;
				const { message } = data;

				toast.error(message, { position: "top-right" });
				return;
			}

			toast.success("Process created successfully", { position: "top-right" });
      cancel();
      refetch();
		});
	};

	const cancel = () => {
		reset();
		onClose();
	};

	return (
		<Drawer
			title={"Add Pipeline"}
			isOpen={state}
			onClose={cancel}
			placement="right"
			width={350}
		>
			<div className="w-96 px-3">
				<form
					name="add-pipeline"
					onSubmit={handleSubmit((values: any) => onFinish(values))}
				>
					<div className="relative w-full mb-3">
						<label
							className="block text-blueGray-600 text-xs font-bold mb-2"
							htmlFor="descriptiond"
						>
							Name*
						</label>
						<TextInput
							{...register("name", {
								required: true,
							})}
							error={errors.name ? true : false}
							errorMessage={errors.name ? "Please input pipeline name" : ""}
							type="text"
							className="w-full h-12"
							placeholder="Enter Name"
						/>
					</div>
					<div className="relative w-full mb-3">
						<label
							className="block text-blueGray-600 text-xs font-bold mb-2"
							htmlFor="path"
						>
							Template
						</label>
						<TextInput
							disabled
							placeholder={template?.name}
							className="w-full"
						/>
					</div>
					<div className="relative w-full mb-3">
						<label
							className="block text-blueGray-600 text-xs font-bold mb-2"
							htmlFor="descriptiond"
						>
							Description*
						</label>
						<TextInput
							{...register("description", {
								required: true,
							})}
							error={errors.description ? true : false}
							errorMessage={
								errors.description ? "Please enter your description" : ""
							}
							type="text"
							className="w-full h-12"
							placeholder="Enter Description"
						/>
					</div>
					<div className="flex space-x-2 p-2">
						<Button
							type="submit"
							loading={isLoading}
							className="bg-prim text-white border-0"
						>
							Submit
						</Button>
						<Button
							onClick={cancel}
							className="bg-blue-100 px-4 py-2 text-sm text-blue-900 hover:bg-blue-200 border-0"
						>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</Drawer>
	);
};
