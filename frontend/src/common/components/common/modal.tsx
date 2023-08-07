import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "./utils";

interface props {
	title: string;
	show: boolean;
  children: ReactNode;
  onClose: () => void;
}
export const Modal = ({ title, show, children, onClose }: props) => {
	const dispatch = useDispatch();

	return (
		<Transition appear show={show} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-50"
				open={show}
				onClose={onClose}
				static={true}
			>
				{/* The backdrop, rendered as a fixed sibling to the panel container */}
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0">
					<div className="flex min-h-full items-center justify-center p-4">
						<Dialog.Panel className="relative p-5 mx-auto w-2/4	rounded bg-white">
							<div className="absolute top-0 right-0 cursor-pointer">
								<XCircleIcon
									onClick={onClose}
									data-testid="hideModal-button"
									className="m-2 h-8 w-8 text-red-800"
								/>
							</div>
							{title && (
								<Dialog.Title
									className={
										"text-xl font-semibold text-gray-900 title-font mb-3"
									}
								>
									{title}
								</Dialog.Title>
							)}
							{children && (
								<div className="w-full h-full overflow-y-auto scroll-smooth p-2 max-h-[90vh]">
									{children}
								</div>
							)}
						</Dialog.Panel>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
