import { useModal } from "@/common/hooks/use-modal";
import Popconfirm from "./popconfirm";

export const useConfirmModal = (
	okText: string = "Submit",
	cancelText: string = "Cancel",
	title: string,
  message: string,
  onConfirm: () => void
) => {
	const { showModal, hideModal, isVisible } = useModal();
	const showConfirmModal = (params?: string | number | object | boolean |  []) =>
		showModal({
			title: title,
			Component: () => (
				<div data-testid="delete-chart-modal">
					<div className="mb-6">{message}</div>
					<div className="flex">
						<button
							onClick={() => {
								hideModal();
							}}
							className="ml-auto mx-4 py-1 px-2 rounded-sm hover:bg-gray-200"
						>
							{cancelText}
						</button>
						<button
							onClick={() => {
								onConfirm();
								hideModal();
							}}
							className="bg-prim text-white py-1 px-2 rounded-sm hover:bg-blue-500"
						>
							{okText}
						</button>
					</div>
				</div>
			),
		});

	return {
		showConfirmModal,
		hideModal,
		isVisible,
	};
};

