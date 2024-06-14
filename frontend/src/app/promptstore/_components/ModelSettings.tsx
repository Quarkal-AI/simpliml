import { AxiosResponse } from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useReducer, useState } from "react"
import { useRecoilState } from "recoil"

import API from "@/API/API"
import { ModelType } from "@/components/Model"
import styles from "@/styles/Prompt/Prompt.module.css"
import { Response } from "@/types"
import { promptStoreModelSettings } from "@/utils/atoms"
import { errorHandler } from "@/utils/errorHandler"

import Hash from "../../../../public/hash.svg"

interface actionType {
	type: string
	payload: string
}

const initialState = {
	max_tokens: "100",
	temperature: "1.0",
	top_p: "0.92",
	top_k: "40",
	repetition_penalty: "1.0",
}

const reducer = (state: typeof initialState, action: actionType): typeof initialState => {
	switch (action?.type) {
		case "max_tokens":
			return { ...state, max_tokens: action.payload }
		case "temperature":
			return { ...state, temperature: action.payload }
		case "top_p":
			return { ...state, top_p: action.payload }
		case "top_k":
			return { ...state, top_k: action.payload }
		case "repetition_penalty":
			return { ...state, repetition_penalty: action.payload }
		default:
			return state
	}
}

export default function ModelSettings() {
	const router = useRouter()
	const [modelSettings, setModelSettings] = useRecoilState(promptStoreModelSettings)

	const [modelData, setModelData] = useState<ModelType[]>([])

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setModelSettings({ ...modelSettings, [name]: value })
	}

	const handleChangeVariable = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setModelSettings({ ...modelSettings, [name]: value })
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setModelSettings({ ...modelSettings, [name]: value })
	}

	const [state, dispatch] = useReducer(reducer, initialState)

	useEffect(() => {
		const getModelData = async () => {
			try {
				const response: AxiosResponse<Response<{ deployments: []; total_page: number }>> =
					await API.post("/deployment", {
						page: 1
					})
				if (response.data.success && response.data.data)
					setModelData(response.data.data.deployments)
			} catch (error: unknown) {
				errorHandler(error, router)
			}
		}
		getModelData()
	}, [])

	return (
		<div style={{ height: "86vh", overflow: "auto" }} className="p-4">
			<h2>Model Settings</h2>
			<label htmlFor="ai-provider">AI Provider and Key</label>
			<div className="select">
				<select name="model_id" id="" onChange={handleFormChange}>
					<option value={""} key={-1}>
						Select Model
					</option>
					{modelData.map((item, index) => {
						return (
							<option value={item.id} key={index}>
								{item.model_id}
							</option>
						)
					})}
				</select>
			</div>
			<div className="mt-2">
				<h3>Max Tokens</h3>
				<div className={`flex ${styles.promptInputContainer} justify-between items-center mt-4`}>
					<div>
						<input
							type="number"
							name="max_tokens"
							onChange={handleChange}
							value={modelSettings.max_tokens}
							className={`${styles.promptInputStyle}`}
							placeholder="500"
							min={16}
							max={1024}
						/>
					</div>
					<div>
						<Image src={Hash.src} width={"100"} height={"100"} alt="hash" className="w-full" />
					</div>
				</div>
			</div>
			<div className="mt-8">
				<h3>Temperature</h3>
				<div className={`flex ${styles.promptInputContainer} justify-between items-center mt-4`}>
					<div>
						<input
							className={`${styles.promptInputStyle}`}
							type="number"
							step={0.1}
							name={"temperature"}
							onChange={handleChange}
							value={parseFloat(modelSettings.temperature)}
							min={0}
							max={2}
							placeholder="16.0"
						/>
					</div>
					<div>
						<Image src={Hash.src} width={"100"} height={"100"} alt="hash" className="w-full" />
					</div>
				</div>
			</div>
			<div className="mt-8">
				<h3>Top_p</h3>
				<div className={`flex ${styles.promptInputContainer} justify-between items-center mt-4`}>
					<div>
						<input
							className={`${styles.promptInputStyle}`}
							name="top_p"
							step={0.01}
							value={parseFloat(modelSettings.top_p)}
							onChange={handleChange}
							placeholder="0.9"
							type="number"
							min={0}
							max={1}
						/>
					</div>
					<div>
						<Image src={Hash.src} width={"100"} height={"100"} alt="hash" className="w-full" />
					</div>
				</div>
			</div>
			<div className="mt-8">
				<h3>Top_k</h3>
				<div className={`flex ${styles.promptInputContainer} justify-between items-center mt-4`}>
					<div>
						<input
							className={`${styles.promptInputStyle}`}
							name="top_k"
							value={parseInt(modelSettings.top_k)}
							onChange={handleChange}
							placeholder="10"
							type="number"
							min={0}
							max={50}
						/>
					</div>
					<div>
						<Image src={Hash.src} width={"100"} height={"100"} alt="hash" className="w-full" />
					</div>
				</div>
			</div>
			<h3 className="mt-8">Repetition Penalty</h3>
			<div className={`flex justify-between items-center mt-4`}>
				<div className={`${styles.frequencyInputContainer} flex items-center`}>
					<input
						type="number"
						min={0}
						step={0.1}
						max={2}
						placeholder="0"
						name="repetition_penalty"
						value={parseFloat(modelSettings.repetition_penalty)}
						onChange={handleChange}
						className={`${styles.frequencyInputStyle}`}
					/>
				</div>
				<div className={`w-1/2`}>
					<input
						type="range"
						min={0}
						step={0.1}
						max={2}
						name="repetition_penalty"
						value={parseFloat(modelSettings.repetition_penalty)}
						onChange={handleChange}
						className={`${styles.frequencyInputRangeStyle}`}
					/>
				</div>
			</div>
		</div>
	)
}
