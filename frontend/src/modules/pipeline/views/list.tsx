import {
	Button,
	Card,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Text,
} from "@tremor/react";
import MediaQuery from "react-responsive";
import { useState } from "react";
import { useGetAllPipelinesQuery } from "../pipeline";
import { usePermission } from "@/common/hooks/use-permission";
import { AddPipeline } from "./add";
import { TemplateModal } from "./template-modal";
import { useModal } from "@/common/hooks/use-modal";
import { useRouter } from "next/router";

export const MyPipelines = () => {
	const router = useRouter();
	const { data, refetch } = useGetAllPipelinesQuery();
	const { hasPermission } = usePermission();
	const [template, setTemplate] = useState<any>();
	const [drawer, setDrawer] = useState<boolean>(false);

	const close = () => {
		setDrawer(false);
		setTemplate(null);
	};

	const open = () => {
		setDrawer(true);
	};

	const onSelect = (res: any) => {
		if (res) open();
		setTemplate(res);
	};

	const { showModal, hideModal } = useModal();

	const showConfirmModal = () =>
		showModal({
			title: "Hop Template",
			Component: () => (
				<div data-testid="delete-chart-modal">
					<div className="mb-6">
						<TemplateModal onSelect={onSelect} hideModal={hideModal} />
					</div>
				</div>
			),
		});

	return (
		<div className="">
			<nav className="mb-5 flex justify-between items-center">
				<div>
					<h2 className="text-3xl">My Pipeline</h2>
					<p className="my-2 text-gray-600">Create your hop pipeline.</p>
				</div>
				<div>
					{hasPermission("pipeline:add") && (
						<Button
							className="bg-prim hover:bg-prim-hover border-0"
							onClick={showConfirmModal}
						>
							Create Pipeline
						</Button>
					)}
				</div>
			</nav>
			<div>
				<Card className="bg-white">
					<Table>
						<TableHead>
							<TableRow>
								<TableHeaderCell>Name</TableHeaderCell>
								<MediaQuery minWidth={1090}>
									<TableHeaderCell className="">Description</TableHeaderCell>
								</MediaQuery>
								<TableHeaderCell></TableHeaderCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(data?.data || []).map((item, index) => (
								<TableRow key={index}>
									<TableCell>
										<Text className="font-sans">{item?.name}</Text>
									</TableCell>
									<MediaQuery minWidth={1090}>
										<TableCell className="">
											<Text>{item?.description}</Text>
										</TableCell>
									</MediaQuery>
									<TableCell>
										<div className="flex space-x-2 justify-end">
											<Button
												onClick={() => router.push(`/pipelines/${item?.id}`)}
												className="hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
											>
												View
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			</div>
			<AddPipeline
				state={drawer}
				template={template}
				onClose={close}
				refetch={refetch}
			/>
		</div>
	);
};
