/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useState } from "react";
import { useTemplatesQuery } from "../pipeline";
import { Dialog, Transition } from "@headlessui/react";
import { Button, Card, Title } from "@tremor/react";
import Tooltip from "@/common/components/common/tooltip";

type Props = {
	state: boolean;
	onSelect: (value: any) => void;
};

const TemplateModal = ({ state, onSelect }: Props) => {
	const getIcon = (name: string) => {
		const icons = [
			"dhis2",
			"csv",
			"excel",
			"fhir",
			"json",
			"api",
			"postgresql",
			"sheet",
		];

		const checkIcon = icons.find((e) => name.toLowerCase().indexOf(e) != -1);

		const icon = checkIcon;

		switch (icon) {
			case "dhis2":
				return "./images/dhis2.png";
			case "csv":
				return "./images/csv.png";
			case "excel":
				return "./images/excel.png";
			case "fhir":
				return "./images/fhir.webp";
			case "json":
				return "./images/json.png";
			case "api":
				return "./images/api.png";
			case "postgresql":
				return "./images/postgresql.png";
			case "sheet":
				return "./images/sheet.png";
		}
	};

	const { data: res } = useTemplatesQuery();

	const [selected, setSelected] = useState<any>(null);

	const handleOk = () => {
		// only continue if the select exist
		if (selected != null) {
			onSelect(selected); // return the select template to the process chain
			setSelected(null); // clear the state and ready for incoming data
		}
	};

	const handleCancel = () => {
		onSelect(false); // send false to the parent to close the modal
	};

	const handleCardClick = (templateObject: any) => {
		setSelected(templateObject); // this keep track of the select only in this component to show it as active
	};

	return (
		<>
			<Transition appear show={state} as={Fragment}>
				<Dialog as="div" className="relative z-50" onClose={handleCancel}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto w-auto h-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-100 p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Hop Template
									</Dialog.Title>
									<div className="border-t">
										<p className="bg-yellow-200 px-3 py-2 rounded-md mt-3 text-gray-500 w-full">
											Note: select your template you want to create from and
											press continue
										</p>
										<div className="grid grid-cols-3 gap-4 my-3">
											{res?.data?.map((data: any, index: number) => (
												<div key={index} className="">
													<Tooltip position="top" fontSize="16px">
														<Card
															title={data?.name}
															onClick={() => handleCardClick(data)}
															className={`border-2 ${
																selected?.name === data?.name
																	? `border-green-800`
																	: `border-gray-300 hover:border-green-800`
															} cursor-pointer`}
														>
															<div>
																<div className="">
																	<Title className="w-full border-b text-sm font-normal text-prim whitespace-nowrap overflow-hidden text-ellipsis">
																		{data?.name}
																	</Title>
																</div>
																<div className="flex justify-center p-3">
																	<img
																		className="h-16"
																		src={getIcon(data?.name)}
																		alt="icon"
																	/>
																</div>
															</div>
														</Card>
													</Tooltip>
												</div>
											))}
										</div>
										<div className="mt-10 flex justify-end space-x-2">
											<Button
												type="button"
												className=" bg-blue-100 px-4 py-2 text-sm text-blue-900 hover:bg-blue-200 border-0"
												onClick={handleCancel}
											>
												Cancel
											</Button>
											<Button
												disabled={!selected}
												onClick={handleOk}
												className="bg-prim hover:bg-prim-hover text-white border-0 text-sm"
											>
												Continue
											</Button>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default TemplateModal;
