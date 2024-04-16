import { IoIosClose } from "react-icons/io";
import ImageCropper from "./ImageCropper";
export default function Modal({ updateAvatar, closeModal }) {
	return (
		<div
			className="relative z-10"
			aria-labelledby="crop-image-dialog"
			role="dialog"
			aria-modal="true"
		>
			<div className="fixed inset-0 bg-opacity-75 transition-all backdrop-blur-sm"></div>
			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full justify-center px-2 py-12 text-center ">
					<div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-slate-50 text-left shadow-xl transition-all">
						<div className="px-5 py-4">
							<button
								type="button"
								className="rounded-md p-1 inline-flex items-center justify-center text-slate-600 hover:bg-slate-100 focus:outline-none absolute top-2 right-2 text-3xl"
								onClick={closeModal}
							>
								<span className="sr-only">Close menu</span>
								<IoIosClose />
							</button>
							<ImageCropper
								updateAvatar={updateAvatar}
								closeModal={closeModal}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
