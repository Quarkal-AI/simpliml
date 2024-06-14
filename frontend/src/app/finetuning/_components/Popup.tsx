import { AxiosResponse } from "axios"
import { RefreshCcw, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import API from "@/API/API"
import Button from "@/components/Button/Button"
import styles from "@/styles/Finetuning/Finetuning.module.css"
import { Response } from "@/types"
import { errorHandler } from "@/utils/errorHandler"

interface MyComponentsProps {
	setPopupDisplay: React.Dispatch<React.SetStateAction<string>>
	pipelineId: string
	popupDisplay: string
}

export default function Popup({ setPopupDisplay, pipelineId, popupDisplay }: MyComponentsProps) {
	const router = useRouter()

	const [state, setState] = useState("logs")
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const [logs, setLogs] = useState<string>("")
	const [pipelineDetails, setPipelineDetails] = useState<string>("")

	const getLogs = async () => {
		if (pipelineId !== "") {
			try {
				const response: AxiosResponse<Response<string>> = await API.post("/finetuning/logs", {
					pipeline_id: pipelineId,
				})
				if (response.data.data) {
					setLogs(response.data.data)
					if (textareaRef.current) {
						textareaRef.current.scrollTop = textareaRef.current.scrollHeight
					}
				}
			} catch (error: unknown) {
				errorHandler(error, router)
			}
		}
	}

	const getPipelineDetails = async () => {
		if (pipelineId !== "") {
			try {
				const response: AxiosResponse<Response<string>> = await API.post("/finetuning/details", {
					pipeline_id: pipelineId,
				})
				if (response.data.data) {
					setPipelineDetails(response.data.data)
				}
			} catch (error) {
				errorHandler(error, router)
			}
		}
	}

	useEffect(() => {
		void getLogs()
		void getPipelineDetails()
	}, [pipelineId, popupDisplay])

	return (
		<div
			className={`fixed minh-[92vh] w-[60vw] ${styles.popup} rounded-t-3xl border-l border-r border-b border-white rounded-b-3xl`}
		>
			<div
				style={{ background: "linear-gradient(to right, #1440b5, #00aaf0)" }}
				className="p-4 text-center font-bold rounded-t-3xl mainHeading flex"
			>
				<div className="flex-1">Details</div>
				<div className="cursor-pointer" onClick={() => setPopupDisplay("none")}>
					<X />
				</div>
			</div>
			<div className="w-8/12 ml-auto  mt-4 flex items-center justify-between">
				<div
					style={{
						background: "#141624",
					}}
					className="flex rounded-full"
				>
					<div
						onClick={() => {
							setState("logs")
						}}
						className="px-8 py-2 rounded-full cursor-pointer"
						style={{
							background: state === "logs" ? "linear-gradient(to right, #1440b5, #00aaf0" : "none",
						}}
					>
						<p className="text-lg">Logs</p>
					</div>
					<div
						onClick={() => {
							setState("pipeline_details")
						}}
						style={{
							background:
								state === "pipeline_details"
									? "linear-gradient(to right, #1440b5, #00aaf0"
									: "none",
						}}
						className="px-8 py-2 rounded-full cursor-pointer"
					>
						<p className="text-lg">Pipeline details</p>
					</div>
				</div>
				{state === "logs" && (
					<Button onClick={() => void getLogs()} className="flex items-center mr-4">
						<RefreshCcw size={"1.25rem"} />
					</Button>
				)}
			</div>
			{state === "logs" && (
				<>
					<div className="px-8 ">
						<textarea
							ref={textareaRef}
							readOnly
							value={logs}
							style={{ background: "none", minHeight: "70vh" }}
							className="resize-none "
						/>
					</div>
				</>
			)}
			{state === "pipeline_details" && (
				<div className=" pl-8 mb-4">
					<textarea
						ref={textareaRef}
						readOnly
						value={JSON.stringify(pipelineDetails, undefined, 2)}
						style={{ background: "none", minHeight: "70vh" }}
						className="resize-none"
					/>
				</div>
			)}
		</div>
	)
}
