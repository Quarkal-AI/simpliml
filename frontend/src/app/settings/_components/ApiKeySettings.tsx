import { AxiosResponse } from "axios"
import { Check, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useRef, useState } from "react"

import API from "@/API/API"
import { Response } from "@/types"
import { errorHandler } from "@/utils/errorHandler"

interface APIDataType {
	apiToken: string
	hfToken: string
}

interface FormDataType {
	hfToken: string
}

const ApiKeySettings = () => {
	const router = useRouter()
	const inputRef = useRef<HTMLInputElement>(null)

	const [check, setCheck] = useState(false)
	const [apiData, setApiData] = useState<APIDataType>()
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState<FormDataType>({
		hfToken: "",
	})

	const handleCopyApi = () => {
		if (inputRef.current) {
			setCheck(true)
			inputRef.current.select()
			inputRef.current.setSelectionRange(0, 99999) // For mobile devices
			void navigator.clipboard.writeText(inputRef.current.value)
		}
		setTimeout(() => {
			setCheck(false)
		}, 1000)
	}

	const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setFormData((prevFormData) => ({
			...prevFormData,
			[id]: value,
		}))
	}

	const handleEditSubmit = async () => {
		if (isEditing) {
			try {
				await API.post("/settings/add_token", formData)
				void getApiData() // Refresh the data after successful update
				setIsEditing(false) // Exit edit mode
			} catch (error: unknown) {
				errorHandler(error, router)
			}
		}
	}

	const getApiData = async () => {
		const response: AxiosResponse<Response<APIDataType>> = await API.get("/api/")
		setApiData(response.data.data)
	}

	useEffect(() => {
		void getApiData()
		// console.log(apiData?.hfToken)
	}, [])

	return (
		<>
			<div className="">
				<h1>API Key</h1>
				<hr />

				<div className="w-[60vw]">
					<p>
						Access tokens programatically authenticate your identity to the SimpliML Inference,
						allowing applications to perform specific actions specified by the scope of permissions.
					</p>
					<div className="relative flex bg-gray-800 rounded-md items-center p-2 my-4 ">
						<input
							type="password"
							placeholder="API Key"
							id="api_key_value"
							className="m-0"
							ref={inputRef}
							value={apiData?.apiToken}
							disabled
							readOnly
						/>
						<Copy onClick={handleCopyApi} className="cursor-pointer" />

						{check && (
							<Check
								color="green"
								className="absolute -right-10 transition-all ease-in-out animate-ping"
							/>
						)}
					</div>

					<div className="py-4 mt-10">
						<h1>HuggingFace API</h1>
						<div className="mt-2 flex justify-between">
							<div className="text-lg mt-2">
								<p>HuggingFace key</p>
							</div>
							<div className="flex w-1/2">
								<div className=" flex bg-gray-800 rounded-md items-center p-2 w-full">
									<input
										type={isEditing ? "text" : "password"}
										id="hfToken"
										className="m-0"
										placeholder="Huggingface Key"
										value={isEditing ? formData?.hfToken : apiData?.hfToken}
										onChange={handleFormChange}
										disabled={!isEditing}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ApiKeySettings
