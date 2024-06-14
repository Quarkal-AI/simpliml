import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ThreeDots } from "react-loader-spinner"
import { useRecoilState, useRecoilValue } from "recoil"

import API from "@/API/API"
import {
	promptStoreModelSettings,
	promptVariable,
	systemPromptAtom,
	userPromptsAtom,
} from "@/utils/atoms"
import { socket } from "@/utils/socket"

// types
import { chatType, responseSendMessage } from "../index"

let firstMessageCame: boolean = true
export default function Chats() {
	const system = useRecoilValue(systemPromptAtom)
	const divRef = useRef<HTMLDivElement>(null)
	const [chat, setChat] = useState<chatType[]>([])
	const [variable, setVariable] = useState<{ [key: string]: string }>({})
	const [displayPromptVariable, setDisplayPromptVariable] = useState("none")
	const [promptVariables, setPromptVariables] = useRecoilState(promptVariable)
	const [assistantReply, setAssistantReply] = useState("")
	const [prompts, setPrompts] = useRecoilState(userPromptsAtom)
	const modelSettings = useRecoilValue(promptStoreModelSettings)

	// This will lead to automatically scroll to the bottom
	useEffect(() => {
		if (divRef.current) {
			divRef.current.scrollTop = divRef.current.scrollHeight
		}
	}, [chat])

	// This function is used to get the prompt variables from the user inputs
	const replaceVariable = (text: string) => {
		const regex = RegExp("{{([^}]+)}}", "g")
		let match
		let results: string[] = []
		while ((match = regex.exec(text))) {
			results.push(match[1])
		}
		results.map((data: string) => {
			text = text.replace(new RegExp(`{{${data}}}`, "g"), variable[data])
		})
		return text
	}

	// This function is used to set the prompt variable value before sending the prompts
	const handleChangeVariable = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVariable((prev) => {
			return { ...prev, [e.target.name]: e.target.value }
		})
	}

	const handleSendMessage = async () => {
		if (modelSettings.model_id === "") return
		setChat((prev) => {
			return [...prev, prompts[prompts.length - 1]]
		})
		setChat((prev) => {
			return [...prev, { role: "assistant", content: "Show Loading" }]
		})
		let promptData = prompts.map((element) => {
			return {
				role: element.role,
				content: replaceVariable(element.content),
			}
		})
		if (system !== "")
			promptData = [{ role: "system", content: replaceVariable(system) }, ...promptData]
		const data = {
			...modelSettings,
			system: system,
			prompt: promptData,
			variables: variable,
		}

		socket.emit("/prompts/send_message", data)
	}

	const promptSendMessageResponseEnded = () => {
		firstMessageCame = false
	}

	const promptSendMessageResponse = (data: responseSendMessage) => {
		if (firstMessageCame) {
			setChat((prev) => {
				prev.pop()
				return prev
			})
			setChat((prev) => [...prev, { role: "assistant", content: "" }])
			firstMessageCame = false
		}
		const { result } = data
		const message = result ? result : ""
		setChat((prev) => {
			const newChat = [...prev]
			newChat[newChat.length - 1].content = (
				newChat[newChat.length - 1].content + message
			).replace("Show Loading", "")
			return newChat
		})
	}

	useEffect(() => {
		socket.connect()
		socket.on("prompt:start", promptSendMessageResponse)
		socket.on(
			"prompt:end",
			promptSendMessageResponseEnded,
		)
		return () => {
			socket.disconnect()
			socket.off("prompt:start")
			socket.off("prompt:end")
		}
	}, [])

	return (
		<div className="col-span-2 border-r border-white border-opacity-20 flex flex-col justify-between p-4">
			<div
				ref={divRef}
				style={{ height: "65vh", overflow: "auto" }}
				className="flex flex-col"
			>
				{chat?.map((data, index) => {
					return (
						<div
							key={index}
							className={`flex ${
								data.role === "user" ? "justify-end" : "justify-start"
							} w-[100%] mt-4`}
						>
							<div className="p-2 w-3/4 rounded bg-gray-800">
								<p>{data.role} : </p>
								{data.content === "Show Loading" && (
									<ThreeDots
										visible={true}
										color="#4fa94d"
										height="40"
										width="40"
										radius="9"
										ariaLabel="three-dots-loading"
										wrapperStyle={{}}
										wrapperClass=""
									/>
								)}
								{data.content !== "Show Loading" && (
									<p>
										{/* {data.role === "user" ? data.content : data.content} */}
										{replaceVariable(data.content)}
									</p>
								)}
							</div>
						</div>
					)
				})}
			</div>
			<div className="flex gap-2 justify-around items-center w-[100%]">
				<div className="relative w-[100%]">
					<div
						style={{
							maxHeight: "100vh",
							display: displayPromptVariable,
							width: "100%",
						}}
						className="flex flex-col justify-end absolute bottom-10 mb-1"
					>
						{promptVariables.map((data, index1) => {
							return data.variables.map((item, index2) => {
								return (
									<div
										key={index1 + index2}
										className="bg-gray-800 cursor-pointer pl-8 pt-2 pb-2 pr-8 space-x-4 flex justify-between items-center w-[100%]"
									>
										<span style={{ fontSize: "20px" }} className="">
											{item}
										</span>
										<input
											style={{
												margin: 0,
												padding: "0px 0px 0px 10px",
												display: "inline",
												width: "70%",
												height: "35px",
												marginLeft: "1rem",
												border: "1px solid white",
											}}
											type="text"
											name={`${item}`}
											placeholder={`Value`}
											onChange={handleChangeVariable}
										/>
									</div>
								)
							})
						})}
					</div>
					<p>{assistantReply}</p>
					<div
						onClick={() => {
							setDisplayPromptVariable((prev) => {
								if (prev === "none") return "block"
								return "none"
							})
						}}
						className="bg-gray-800 pl-8 pr-8 pt-2 pb-2 rounded cursor-pointer flex justify-between w-[100%]"
					>
						<h3>Prompt Variables</h3>
						{displayPromptVariable === "none" && <ChevronUp size={20} />}
						{displayPromptVariable === "block" && <ChevronDown size={20} />}
					</div>
				</div>
				<button
					className={
						modelSettings.model_id !== "" ? "button-t1" : "button-bordered"
					}
					onClick={handleSendMessage}
				>
					Send
				</button>
			</div>
		</div>
	)
}
