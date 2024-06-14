import { useState } from "react"
import { useRecoilState } from "recoil"

import { promptResponseAtom } from "@/utils/atoms"

import Output from "./Output"
import Prompt from "./Prompt"

interface modelData {
	name: string
	task_type: string
	description: string
	architectures: string
	model_id: string
	license: string
	image: string
}

interface promptResponsed {
	data: string
	responseTime: string
	coldTime: string
	promptToken: string
	completionToken: string
	totalToken: string
}

interface MyComponentProps {
	modelData?: modelData
	loading: boolean
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
	submitButtonVisibility: DocumentVisibilityState
	setSubmitButtonVisibility: React.Dispatch<
		React.SetStateAction<DocumentVisibilityState>
	>
	params: {
		model_id: string
	}
}

export default function Explore({
	modelData,
	params,
	loading,
	setLoading,
	submitButtonVisibility,
	setSubmitButtonVisibility,
}: MyComponentProps) {
	const [promptResponseState, setPromptResponseState] =
		useRecoilState(promptResponseAtom)

	const [modelOutput, setModelOutput] = useState<promptResponsed>()

	const promptResponse = (data: promptResponsed) => {
		setPromptResponseState((prev) => {
			return {
				data: prev?.data + data.data,
				responseTime: data.responseTime,
				coldTime: data.coldTime,
				promptToken: data.promptToken,
				completionToken: data.completionToken,
				totalToken: data.totalToken,
			}
		})
	}

	const clearConsole = () => {
		setPromptResponseState({
			data: "",
			responseTime: "",
			coldTime: "",
			promptToken: "",
			completionToken: "",
			totalToken: "",
		})
	}
	return (
		<div className="mt-4">
			<div className="mt-8 flex space-x-8">
				<Prompt
					params={params}
					loading={loading}
					setLoading={setLoading}
					promptResponse={promptResponse}
					submitButtonVisibility={submitButtonVisibility}
					setSubmitButtonVisibility={setSubmitButtonVisibility}
					clearConsole={clearConsole}
				/>
				<Output
					data={modelOutput}
					promptResponseState={promptResponseState}
					loading={loading}
				/>
			</div>
		</div>
	)
}
