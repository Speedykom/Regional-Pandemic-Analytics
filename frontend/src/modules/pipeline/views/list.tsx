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
import { useFindAllQuery, useTemplatesQuery } from "../pipeline";
import ViewButton from "./ViewButton";
import { usePermission } from "@/common/hooks/use-permission";
import { AddPipeline } from "./add";
import { TemplateModal } from "./template-modal";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "@/common/components/common/utils";

export const MyPipelines = () => {
	const { data, refetch } = useFindAllQuery();
	const { hasPermission } = usePermission();
	const [template, setTemplate] = useState<any>();
	const [drawer, setDrawer] = useState<boolean>(false);
	const { show } = useSelector((state: any) => state?.modal);
	const dispatch = useDispatch();

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
							onClick={() => {
								dispatch(openModal());
							}}
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
											<ViewButton id={item?.id} />
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			</div>
			<TemplateModal show={show} onSelect={onSelect} />
			<AddPipeline
				state={drawer}
				template={template}
				onClose={close}
				refetch={refetch}
			/>
		</div>
	);
};
