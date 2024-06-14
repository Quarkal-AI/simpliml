import { X } from "lucide-react"

interface props {
	title?: string
	heading?: string
	callback: () => void
	showHideModal: () => void
	content?: string
}

export default function DeleteModalPopup({
	title = "Are you sure you want to delete this ?",
	callback,
	showHideModal,
	content,
}: props) {
	return (
		<div className="">
			<div className="z-[99] fixed h-content left-1/2 -translate-x-1/2 w-1/4 top-1/2 -translate-y-1/2 flex flex-col rounded-xl border border-white bg-black-900 overflow-clip">
				<div className="relative p-4 flex items-center justify-center text-center back-gradient">
					<h3>Confirmation</h3>
					<X onClick={() => showHideModal()} className="absolute right-4 cursor-pointer" />
				</div>
				<div className="py-4 px-8 flex flex-col items-center gap-8 text-center">
					<h2 className="m-0 p-0">{title}</h2>
					{content && <p className="mt-0 text-red-500 text-s">{content}</p>}
					<div className="w-full flex justify-between">
						<button onClick={() => showHideModal()} className="button-bordered">
							Cancel
						</button>
						<button
							onClick={() => {
								callback()
								showHideModal()
							}}
							className="button-t1"
						>
							Confirm
						</button>
					</div>
				</div>
			</div>
			<div className="absolute top-0 left-0 w-full h-full bg-black-900 opacity-40 z-0"></div>
		</div>
	)
}
