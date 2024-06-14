import { Check, CopyIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

import API from "@/API/API"
import { data1, data2 } from "@/data/apidocs"
import docsStyles from "@/styles/Explore/Docs/Docs.module.css"
import styles from "@/styles/Explore/Explore.module.css"

import Arrowup from "../../../../../../public/arrow_up.svg"

interface modelData {
	name: string
	task_type: string
	description: string
	architectures: string
	model_id: string
	license: string
	image: string
}

interface MyComponentProps {
	modelData?: modelData
	params: {
		model_id: string
	}
}

export default function Docs({ modelData, params }: MyComponentProps) {
	const [tick, setTick] = useState(false)
	const [tickForCurl, setTickForCurl] = useState(false)
	const [apiData, setApiData] = useState("")

	let curl = `curl --location "https://api.simpliml.com/v1/chat/completions" \
		\n --header "Content-Type: application/json" \
		\n --header "Authorization: Bearer ******** " \
		\n --data '
		{
			"messages": [
			{
				"role": "system",
				"content": "You are a AI assistant which ans the question in accurate and polite manner"
			},
			{
				"role": "user",
				"content": "what is gravity"
			}
			],
			"repetition_penalty": 1.0,
			"model": "${params.model_id}",
			"max_tokens": 200,
			"top_p": 1,
			"top_k": 50,
			"temperature": 0.4,
			"stream": false
		}'
  	`

	let copycurl = `curl --location "https://api.simpliml.com/v1/chat/completions" \
		\n --header "Content-Type: application/json" \
		\n --header "Authorization: Bearer ${apiData}" \
		\n --data '
		{
			"messages": [
			{
				"role": "system",
				"content": "You are a AI assistant which ans the question in accurate and polite manner"
			},
			{
				"role": "user",
				"content": "what is gravity"
			}
			],
			"repetition_penalty": 1.0,
			"model": "${params.model_id}",
			"max_tokens": 200,
			"top_p": 1,
			"top_k": 50,
			"temperature": 0.4,
			"stream": false
		}'
 	 `

	const output = {
		success: true,
		data: {
			id: "chatcmpl-a689c4258e854abc9d4c97825a9ff141",
			object: "text_completion",
			created: 1702558175,
			model: "lmsys/vicuna-7b-v1.3",
			choices: [
				{
					index: 0,
					message: {
						role: "assistant",
						content:
							"Gravity is a natural force that attracts any two objects with mass towards each other. It is the force that gives weight to physical objects and causes them to fall to the ground when dropped. This force is also responsible for keeping planets in their orbits around the sun. The more mass an object has, the stronger its gravitational pull. The closer objects are to each other, the stronger the gravitational pull between them. Sir Isaac Newton is often associated with the discovery of gravity, but it was Albert Einstein who later improved our understanding of it with his theory of general relativity.",
					},
					finish_reason: "stop",
				},
			],
			usage: {
				prompt_tokens: 28,
				completion_tokens: 113,
				total_tokens: 141,
			}
		},
	}

	const getApi = async () => {
		try {
			const data = await API.get("/api")
			setApiData(data.data.data.apiToken)
		} catch (error: any) {
			alert(error.response.data.message)
		}
	}

	const getAPIToken = () => {
		try {
			const tempInput = document.createElement("input")
			tempInput.value = apiData
			document.body.appendChild(tempInput)
			tempInput.select()
			document.execCommand("copy")
			setTick(true)
			document.body.removeChild(tempInput)
			setTimeout(() => {
				setTick(false)
			}, 1000)
		} catch (error: any) {
			alert(error.response.data.message)
		}
	}

	const handleCopyContent = () => {
		const contentToCopy = copycurl
		const tempInput = document.createElement("textarea")
		tempInput.value = contentToCopy
		document.body.appendChild(tempInput)
		tempInput.select()
		document.execCommand("copy")
		document.body.removeChild(tempInput)

		setTickForCurl(true)
		setTimeout(() => {
			setTickForCurl(false)
		}, 1000)
	}

	const copyText = (id: string) => {
		const element: any = document.getElementById(id)
		var tempInput = document.createElement("input")
		tempInput.value = element.innerHTML
		document.body.appendChild(tempInput)
		tempInput.select()
		document.execCommand("copy")
		document.body.removeChild(tempInput)
	}

	useEffect(() => {
		getApi()
	}, [])

	return (
		<div>
			<div className="flex justify-between items-center mt-12">
				<div className={`${docsStyles.runTheModelHeading}`}>
					<span>Run the Model</span>
				</div>
				<div>
					<div className={`${docsStyles.apiTokenTextStyle}`}>
						<p>Next, copy your API token and authenticate the request</p>
					</div>
					<div
						className={`relative flex justify-between items-center bg-gray-900 p-2 mt-2 rounded-md`}
					>
						<div>
							<input
								type="password"
								value={"************************************"}
								className="bg-transparent m-0"
								readOnly
							/>
						</div>
						<div onClick={getAPIToken} className="cursor-pointer">
							<CopyIcon />
							{tick && (
								<Check
									color="green"
									className="absolute top-1/2 -translate-y-1/2 -right-10 animate-ping"
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="mt-8 flex justify-between items-center">
				<div>
					<p className={`${docsStyles.textDecoration}`}>Then, run the model:</p>
				</div>
				<div
					className={`flex justify-between items-center space-x-2 border border-white ${docsStyles.languageSelectorPadding} ${docsStyles.textDecoration}`}
				>
					<div>curl</div>
					<div>
						<Image
							src={Arrowup.src}
							width={"100"}
							height={"100"}
							alt="Arrowup"
							className={`${docsStyles.arrowUpImage}`}
						/>
					</div>
				</div>
			</div>
			<div className={`${docsStyles.codeContainer} flex justify-between mt-4`}>
				<div
					className={`${docsStyles.codeContainerSize}`}
					style={{ padding: "1.61rem 1.52rem 1.52rem 1.56rem" }}
				>
					<textarea
						id="curl"
						rows={15}
						readOnly
						value={curl}
						className={`${styles.promptOutputStyle}`}
						onClick={() => {}}
					/>
				</div>
				<div
					onClick={() => {
						setTickForCurl(true)
						setTimeout(() => {
							setTickForCurl(false)
							handleCopyContent()
						}, 1000)
					}}
					className={`${styles.copyImageContainer} ${docsStyles.copyImageContainerMargin} relative cursor-pointer`}
				>
					<CopyIcon />
					{tickForCurl && (
						<Check
							color="green"
							className="absolute top-0 -right-10 animate-ping"
						/>
					)}
				</div>
			</div>
			<div className="flex justify-between mt-8 space-x-8">
				<div className="w-1/2">
					<h1 className={`${docsStyles.inputHeadingStyles}`}>Inputs</h1>
					{data1?.map((data, index) => {
						return (
							<div className="mt-8" key={index}>
								<div className="flex justify-between">
									<div className="space-x-2">
										<span className={`${docsStyles.textDecoration}`}>
											{data.data}
										</span>
										<span className={`${docsStyles.inputTypeStyles}`}>
											{data.data_type}
										</span>
									</div>
									<div>
										<Image
											src={data.image.src}
											width={"100"}
											height={"100"}
											alt="Hashtag"
											className={`${docsStyles.hashtagImageSize}`}
										/>
									</div>
								</div>
								<div className="mt-4">
									<p className={`${docsStyles.textDecoration} mt-4`}>
										{data.description}
									</p>
								</div>
								<div className="mt-4">
									<hr />
								</div>
							</div>
						)
					})}
					{data2?.map((data, index) => {
						return (
							<div className="mt-8" key={index}>
								<div className="flex justify-between">
									<div className="space-x-2">
										<span className={`${docsStyles.textDecoration}`}>
											{data.data}
										</span>
										<span className={`${docsStyles.inputTypeStyles}`}>
											{data.data_type}
										</span>
									</div>
									<div>
										<Image
											src={data.image.src}
											width={"100"}
											height={"100"}
											alt="Hashtag"
											className={`${docsStyles.hashtagImageSize}`}
										/>
									</div>
								</div>
								<div className="mt-4">
									<p className={`${docsStyles.textDecoration} mt-4`}>
										{data.description}
									</p>
								</div>
								<div className="mt-4">
									<p className={`${docsStyles.textDecoration} mt-4`}>
										<span>Default Value:</span> {data.default_value}
									</p>
								</div>
								<div className="mt-4">
									<hr />
								</div>
							</div>
						)
					})}
				</div>
				<div className="w-1/2">
					<h1 className={`${docsStyles.inputHeadingStyles}`}>Output Schema</h1>
					<div className="mt-8">
						<p className={`${docsStyles.textDecoration}`}>
							This is the raw JSON schema describing the model’s output
							structure.
						</p>
					</div>
					<div className={`${docsStyles.outputContainer} mt-4`}>
						<textarea
							rows={20}
							readOnly
							value={JSON.stringify(output, undefined, 2)}
							className={`${styles.promptOutputStyle}`}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
