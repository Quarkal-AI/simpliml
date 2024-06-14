import { X } from "lucide-react"
import { Dispatch, ReactNode, SetStateAction } from "react"

interface PopupProps {
	visibility: boolean
	headerLabel: string
	body?: ReactNode
	classname?: string
	setVisibility: Dispatch<SetStateAction<boolean>>
}

export function Popup(props: PopupProps) {
	return (
		props.visibility === true && (
			<div
				className={`z-100 fixed top-0 left-[0vw] right-0 h-[100vh] flex items-center justify-center`}
			>
				<div className={`w-[30rem] bg-[#0e1018] rounded-t-3xl`}>
					{/* Header */}
					<div
						className="py-4 flex relative rounded-t-2xl border-none"
						style={{
							background: "linear-gradient(to right, #1440b5, #00aaf0)",
						}}
					>
						<p className="w-full text-center font-bold">{props.headerLabel}</p>
						<div className="absolute right-2 cursor-pointer">
							<X className="float-right" onClick={() => props.setVisibility(false)} />
						</div>
					</div>

					{/* Body */}
					<div className="border-r border-l border-b border-white  rounded-b-2xl border-opacity-80">
						{props.body}
					</div>
				</div>
			</div>
		)
	)
}
