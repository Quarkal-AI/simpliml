import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useReducer, useState } from "react"
import { useRecoilState } from "recoil"

import styles from "@/styles/Explore/Explore.module.css"
import { promptInputAtom, promptResponseAtom } from "@/utils/atoms"
import { errorHandler, unauthorizedErrorHandler } from "@/utils/errorHandler"
import { socket } from "@/utils/socket"

import arrow_up from "../../../../../public/arrow_up.svg"
import Advanceoptions from "./Advanceoptions"
import Frequencyandmirostat from "./Frequencyandmirostat"
import Textarea from "./Textarea"

interface promptResponsed {
	data: string
	responseTime: string
	coldTime: string
	promptToken: string
	completionToken: string
	totalToken: string
}

interface MyComponentProps {
	loading: boolean
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
	promptResponse: (data: promptResponsed) => void
	submitButtonVisibility: DocumentVisibilityState
	setSubmitButtonVisibility: React.Dispatch<
		React.SetStateAction<DocumentVisibilityState>
	>
	clearConsole: () => void
	params: {
		model_id: string
	}
}

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

const reducer = (
	state: typeof initialState,
	action: actionType,
): typeof initialState => {
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

export default function Prompt({
	loading,
	setLoading,
	promptResponse,
	params,
	submitButtonVisibility,
	setSubmitButtonVisibility,
	clearConsole,
}: MyComponentProps) {
	const router = useRouter()

	const [advanceOptionDisplay, setAdvanceOptionDisplay] = useState("none")
	const [promptInput, setPromptInput] = useRecoilState(promptInputAtom)
	// const [submitButtonVisibility, setSubmitButtonVisibility] = useState<DocumentVisibilityState>("visible")
	const [prompt, setPrompt] = useState<string>("")
	const [state, dispatch] = useReducer(reducer, initialState)
	const [promptResponseState, setPromptResponseState] =
		useRecoilState(promptResponseAtom)

	const getResponse = async () => {
		try {
			setLoading(true)
			setSubmitButtonVisibility("hidden")
			clearConsole()
			socket.emit("/models/infer", {
				...state,
				prompt: promptInput,
				model: params.model_id,
				stream: false,
				use_cache: false,
			})
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	const resetState = () => {
		dispatch({ type: "max_tokens", payload: "100" })
		dispatch({ type: "temperature", payload: "1.0" })
		dispatch({ type: "top_p", payload: "0.92" })
		dispatch({ type: "top_k", payload: "40" })
		dispatch({ type: "repetition_penalty", payload: "1.0" })
		setPromptInput("")
		setPromptResponseState({
			data: "",
			responseTime: "",
			coldTime: "",
			promptToken: "",
			completionToken: "",
			totalToken: "",
		})
	}

	useEffect(() => {
		socket.on("unauthorized", () => {
			unauthorizedErrorHandler(router)
		})
		socket.on("result", (data) => {
			setLoading(false)
			promptResponse({
				data: data.result,
				responseTime: data?.response_time,
				coldTime: data?.cold_start,
				promptToken: data?.prompt_tokens,
				completionToken: data?.completion_tokens,
				totalToken: data?.total_tokens,
			})
		})
		socket.on("stream:ended", () => {
			setSubmitButtonVisibility("visible")
		})

		return () => {
			socket.off("unauthorized")
			socket.off("result")
			socket.off("stream:ended")
		}
	}, [])

	return (
		<>
			<div className="w-1/2">
				<div className="flex justify-between items-center">
					<div className={`${styles.inputTextStyle}`}>Input</div>
					<div className="flex space-x-2">
						<div
							onClick={getResponse}
							style={{
								visibility: submitButtonVisibility,
							}}
							className={`${styles.submitButtonStyle} cursor-pointer`}
						>
							<span>Submit</span>
						</div>
						<div
							onClick={resetState}
							className={`${styles.resetButtonStyle} cursor-pointer`}
						>
							Reset
						</div>
					</div>
				</div>
				<div className={`flex justify-between items-center mt-4`}>
					<div className={`${styles.promptWordStyle}`}>
						<span>Prompt</span>
					</div>
					<div className={`flex space-x-4`}>
						<div className={`${styles.shitKeyContainer}`}>
							<span className={`${styles.shfitKeyStyle}`}>Shift</span>
						</div>
						<div>
							<span>+</span>
						</div>
						<div className={`${styles.returnKeyContainer}`}>
							<span className={`${styles.returnKeyStyle}`}>Return</span>
						</div>
						<div>
							<span>to add a new line</span>
						</div>
					</div>
				</div>
				<Textarea
					prompt={prompt}
					setPrompt={setPrompt}
					promptInput={promptInput}
					setPromptInput={setPromptInput}
					row={10}
				/>
				<div className="mt-4">
					<p>
						The prompt(s) to generate completions for, encoded as a string,
						array of strings, array of tokens, or array of token arrays.
					</p>
				</div>
				{/* <div className="mt-8">
          <p>Grammar</p>
        </div>
        <Textarea setPrompt={setPrompt} row={1} /> */}
				{/* <div className={`flex justify-between items-center mt-4`}>
          <div className={`${styles.promptWordStyle}`}>
            <span>Jsonschema</span>
          </div>
          <div className={`flex space-x-4`}>
            <div className={`${styles.shitReturnKeyContainer}`}>
              <span>Shift</span>
            </div>
            <div>
              <span>+</span>
            </div>
            <div className={`${styles.shitReturnKeyContainer}`}>
              <span>Return</span>
            </div>
            <div>
              <span>to add a new line</span>
            </div>
          </div>
        </div>
        <Textarea setPrompt={setPrompt} row={10} />
        <div className="mt-4">
          <p>
            JSON schema for the generated output. Use either grammar or
            jsonschema. You can use the jsonschema in the prompt by using the
            special string
          </p>
        </div> */}
				<div className="space-y-8 mt-4">
					<div
						onClick={() => {
							setAdvanceOptionDisplay(
								advanceOptionDisplay === "block" ? "none" : "block",
							)
						}}
						className={`flex justify-between items-center ${styles.promptInputContainer}`}
					>
						<div>Advance Options</div>
						<div
							className={`${
								advanceOptionDisplay === "none" ? styles.rotateDivVertical : ""
							}`}
						>
							<Image
								src={arrow_up.src}
								width={"100"}
								height={"100"}
								alt="arrow_up"
								className="w-full"
							/>
						</div>
					</div>
					{advanceOptionDisplay === "block" && (
						<>
							<Advanceoptions state={state} dispatch={dispatch} />{" "}
							<Frequencyandmirostat state={state} dispatch={dispatch} />
						</>
					)}
					{/* <div
            onClick={() => {
              setFrequencyMirostatOptionDisplay(
                frequencyMirostatDisplay === "block" ? "none" : "block"
              );
            }}
            className={`flex justify-between items-center ${styles.promptInputContainer}`}
          >
            <div>Frequency & Mirostat</div>
            <div>
              <Image
                src={arrow_up.src}
                width={"100"}
                height={"100"}
                alt="arrow_up"
                className="w-full"
              />
            </div>
          </div> */}
					{/* {frequencyMirostatDisplay === "block" && <Frequencyandmirostat />} */}
				</div>
			</div>
		</>
	)
}
