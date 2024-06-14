import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import API from "@/API/API"
import Loader from "@/components/Loader"
import styles from "@/styles/Logs/DetailedSideBar.module.css"
import { errorHandler } from "@/utils/errorHandler"

export const DetailedSideBar = (props: {
	visibility: boolean
	traceId: string
	setVisibility: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const router = useRouter()

	const [logDetails, setLogDetails] = useState<any>(undefined)
	const [loaded, setLoaded] = useState(false)

	const fetchEntireLogDetail = async () => {
		try {
			const res = await API.post(`/logs/details`, {
				traceId: props.traceId,
			})
			setLogDetails(res.data.data)
			setLoaded(true)
		} catch (error: unknown) {
			// console.log("error in fetching entire log details", error);
			errorHandler(error, router)
		}
	}

	const formContentForRequestUnderPrettyOnChatCompletionRoute = (messages: any[]) => {
		let wrapperDiv = document.createElement("div")

		messages.forEach((message: any) => {
			let innerDiv = document.createElement("div")

			let role = document.createElement("p")
			role.innerHTML = message.role
			role.style.textTransform = "capitalize"
			role.style.fontWeight = "700"

			if (message.role === "user") {
				role.style.color = "rgb(217, 119, 6)"
			} else if (message.role === "system") {
				role.style.color = "#2ecc71"
			} else if (message.role === "assistant") {
				role.style.color = "#9b59b6"
			}

			let content = document.createElement("p")
			content.innerHTML = message.content

			let lineBreak = document.createElement("br")

			innerDiv.appendChild(role)
			innerDiv.appendChild(lineBreak)
			innerDiv.appendChild(content)
			innerDiv.appendChild(lineBreak)

			wrapperDiv.appendChild(innerDiv)
		})

		return wrapperDiv
	}

	const manageRequestContent = (type: "json" | "pretty", node: HTMLElement) => {
		if (type === "json") {
			let child: HTMLPreElement = document.createElement("pre")
			child.style.whiteSpace = "pre-wrap"
			child.style.wordBreak = "keep-all"
			child.innerHTML = `${JSON.stringify(logDetails.fields.meta.req, undefined, 2)}`

			node.appendChild(child)
		} else {
			if (logDetails.fields.meta.req.url === "/v1/completions")
				node.innerHTML = logDetails.fields.meta.req?.requestBody?.prompt
			else if (logDetails.fields.meta.req.url === "/v1/chat/completions") {
				const messages = logDetails.fields.meta.req?.body?.messages
				if (messages.length > 0) {
					const wrapperDiv = formContentForRequestUnderPrettyOnChatCompletionRoute(messages)
					node.appendChild(wrapperDiv)
				}
			}
		}
	}

	const manageResponseContent = (type: "json" | "pretty", node: HTMLElement) => {
		// JSON
		if (type === "json") {
			let child: HTMLPreElement = document.createElement("pre")
			child.style.whiteSpace = "pre-wrap"
			child.style.wordBreak = "keep-all"

			child.innerHTML = `${JSON.stringify(logDetails.fields.meta.res, undefined, 2)}`

			node.appendChild(child)
		} else {
			if (logDetails.fields.meta.req.url === "/v1/completions") {
				const res = logDetails.fields.meta.res?.data?.choices[0]?.text
				res == undefined ? (node.innerHTML = "No Response") : (node.innerHTML = res)
			} else if (logDetails.fields.meta.req.url === "/v1/chat/completions") {
				const messages = logDetails.fields.meta.res?.body?.choices
				const res = messages[0]?.message?.content
				res == undefined ? (node.innerHTML = "No Response") : (node.innerHTML = res)
			}
		}
	}

	const changeContent = (
		id: "user-request-content" | "user-response-content",
		type: "pretty" | "json",
	) => {
		const node = document.getElementById(id)
		if (node) {
			// removing all the child nodes from the element to insert new content
			while (node.firstChild) {
				node.removeChild(node.lastChild!)
			}

			if (id === "user-request-content") manageRequestContent(type, node)
			else if (id === "user-response-content") manageResponseContent(type, node)
		}
	}

	const applyClassesForActiveAndInactiveButton = (
		makeActiveBtnId: string,
		prevActiveBtnId: string,
	) => {
		document.getElementById(prevActiveBtnId)?.classList.remove(`${styles.activeButton}`)
		document.getElementById(makeActiveBtnId)?.classList.add(`${styles.activeButton}`)
	}

	useEffect(() => {
		if (props.visibility) {
			setLoaded(false)
			fetchEntireLogDetail()
		}
	}, [props.visibility, props.traceId])

	useEffect(() => {
		if (logDetails) {
			changeContent("user-request-content", "pretty")
			changeContent("user-response-content", "pretty")
		}
	}, [logDetails])

	return (
		props.visibility &&
		(loaded === true ? (
			<div
				className={` z-10 w-1/3 ${styles.slideLeft} ${styles.span} overflow-hidden`}
				id={"logSummary"}
			>
				<div className={`absolute top-10 pl-8 w-full pr-8 h-full`}>
					<div className={`mb-2 flex items-center justify-between`}>
						<div className="flex flex-row">
							<p className={styles.keys}>Date: </p>
							<p className={`ml-2 ${styles.values}`}>{logDetails["@timestamp"]}</p>
						</div>
						<button onClick={() => props.setVisibility(false)}>
							<X />
						</button>
					</div>

					<div className={`mb-2 flex items-center`}>
						<p className={styles.keys}>Trace ID: </p>
						<p className={`ml-2 ${styles.values}`}>{logDetails.fields.meta.trace_id}</p>
					</div>

					<div
						className={`w-max p-1 pl-3 pr-3 mb-2 rounded-3xl text-md`}
						style={{ backgroundColor: "#1D2746" }}
					>
						{logDetails.fields.meta.req?.model}
					</div>

					<div className={`mb-2 flex items-center`}>
						<p className={styles.keys}>Server: </p>
						<p className={`ml-2 ${styles.values}`}>{logDetails.fields.meta.req.server}</p>
					</div>

					<div className={`mb-2 flex items-center`}>
						<p className={styles.keys}>Status code: </p>
						<p className={`ml-2 ${styles.values}`}>{logDetails.fields.meta.res.statusCode}</p>
					</div>

					<div className={`mb-2 flex items-center`}>
						<p className={styles.keys}>Response timing: </p>
						<p className={`ml-2 ${styles.values}`}>
							{Number(logDetails.fields.meta.responseTime)}
							ms
						</p>
					</div>

					<div className="h-full">
						<div className={`w-full h-1/4`}>
							<div className={`flex w-full justify-between items-center`}>
								<p className={styles.keys}>
									Request ({logDetails.fields.meta.res?.data?.usage?.prompt_tokens} tokens)
								</p>
								<div className={`p-0.5 border border-gray-500 rounded`}>
									<button
										className={`px-2 py-1 rounded text-sm ${styles.activeButton}`}
										id="request-pretty-button"
										onClick={() => {
											applyClassesForActiveAndInactiveButton(
												"request-pretty-button",
												"request-json-button",
											)

											changeContent("user-request-content", "pretty")
										}}
									>
										Pretty
									</button>
									<button
										className={`px-2 py-1 rounded text-sm`}
										id="request-json-button"
										onClick={() => {
											applyClassesForActiveAndInactiveButton(
												"request-json-button",
												"request-pretty-button",
											)

											changeContent("user-request-content", "json")
										}}
									>
										Json
									</button>
								</div>
							</div>
							<div
								className={`w-full border border-gray-500 p-3 mt-2 rounded ${styles.outputDiv} h-full overflow-y-scroll`}
							>
								<div
									className={`text-sm opacity-80 w-full overflow-hidden`}
									id="user-request-content"
								></div>
							</div>
						</div>

						<div className={`w-full h-1/4 mt-12`}>
							<div className={`flex w-full justify-between items-center`}>
								<p className={styles.keys}>
									Response ({logDetails.fields.meta.res?.data?.usage?.completion_tokens} tokens)
								</p>
								<div className={`p-0.5 border border-gray-500 rounded`}>
									<button
										className={`${styles.activeButton} px-2 py-1 rounded text-sm`}
										id="response-pretty-button"
										onClick={() => {
											applyClassesForActiveAndInactiveButton(
												"response-pretty-button",
												"response-json-button",
											)

											changeContent("user-response-content", "pretty")
										}}
									>
										Pretty
									</button>
									<button
										className={`px-2 py-1 rounded text-sm`}
										id="response-json-button"
										onClick={() => {
											applyClassesForActiveAndInactiveButton(
												"response-json-button",
												"response-pretty-button",
											)

											changeContent("user-response-content", "json")
										}}
									>
										Json
									</button>
								</div>
							</div>
							<div
								className={`w-full border border-gray-500 p-3 mt-2 rounded ${styles.outputDiv} overflow-y-scroll h-full`}
							>
								<p className={`text-sky-500 font-medium text-sm`}>Assistant</p>
								<div className={`text-sm opacity-80 w-full`} id="user-response-content"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		) : (
			<Loader />
		))
	)
}
