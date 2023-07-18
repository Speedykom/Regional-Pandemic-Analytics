import { ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface props {
	openModal: boolean;
	onClose: () => void;
	title: string;
	body: ReactNode;
	footer?: ReactNode;
}

export const IGADModal = ({ title, openModal, onClose, body, footer }: props) => {
	return (
		<>
			{openModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-auto my-6 mx-auto max-w-3xl">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
								{/*header*/}
								<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
									<h3 className="text-xl font-semibold">{title}</h3>
									<button
										className="p-1 ml-auto bg-transparent border-0 text-gray-500  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
										onClick={onClose}
									>
										<FiX />
									</button>
								</div>
								{/*body*/}
								{body}
								{/*footer*/}
								{footer}
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</>
	);
};
