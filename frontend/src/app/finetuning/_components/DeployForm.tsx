"use client"

import { ArrowLeftIcon, ArrowRightIcon, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import { useRecoilValue } from "recoil"

import API from "@/API/API"
import Loader from "@/components/Loader"
import { datasetFormAtom, deploymentFormAtom, fineTuningFormAtom } from "@/utils/atoms"
import { errorHandler } from "@/utils/errorHandler"

const DeployForm = ({
	modalDeployForm,
	usage,
}: {
	modalDeployForm: React.Dispatch<React.SetStateAction<boolean>>
	usage: string
}) => {
	const router = useRouter()

	const datasetForm = useRecoilValue(datasetFormAtom)
	const finetuningModelFormData = useRecoilValue(fineTuningFormAtom)
	const deploymentForm = useRecoilValue(deploymentFormAtom)

	const [formState, setFormState] = useState<number>(0)
	const [loading, setLoading] = useState(false)

	const handleNextClick = () => {
		if (formState === 0 && deploymentForm.deployment_name !== "" && deploymentForm.gpu !== "") {
			setFormState(formState + 1)
		} else {
			setFormState(formState + 1)
		}
	}

	const handleDeploy = async () => {
		try {
			setLoading(true)
			if (datasetForm.file !== null) {
				const formData = new FormData()
				formData.append("file", datasetForm.file)
				await API.post("/finetuning/upload_dataset", formData)
			}

			const response = await API.post("/finetuning/create", {
				...finetuningModelFormData,
				...deploymentForm,
				dataset_id: datasetForm.dataset_id,
			})

			if (response.status === 200) {
				toast.success("Deployed successfully")
			}

			window.location.reload()
		} catch (error: unknown) {
			errorHandler(error, router)
		} finally {
			setLoading(false)
			modalDeployForm(false)
		}
	}

	return (
		<div className="">
			<div className="z-[99] fixed min-h-[40vh] h-content left-1/2 -translate-x-1/2 w-1/2 top-[5vh] flex flex-col  rounded-xl border border-white bg-black-900 overflow-clip">
				<div className="relative p-4 flex items-center justify-center text-center back-gradient">
					<h3>Create</h3>
					<X className="absolute right-4 cursor-pointer" onClick={() => modalDeployForm(false)} />
				</div>
				{loading ? (
					<Loader />
				) : (
					<div>
						<div className="py-4 px-12 flex flex-col items-center justify-between gap-4">
							<div className="flex justify-evenly">
								{[1, 2].map((item, index) => {
									return (
										<div className="flex items-center w-full" key={index}>
											<div
												className={
													formState >= index
														? "rounded-full w-9 h-9 flex items-center justify-center back-gradient"
														: "rounded-full w-9 h-9 flex items-center justify-center border border-gray-500"
												}
											>
												{item}
											</div>
											{index < 1 && <div className="border-t w-20 h-0 opacity-20"></div>}
										</div>
									)
								})}
							</div>
							<div className="overflow-auto h-[25rem] w-full">
								{formState == 0 && (
									<h3 className="text-center mb-[1rem]">Enter Deployment Details </h3>
								)}
								{formState == 1 && <h3 className="text-center mb-[1rem]">Review </h3>}
							</div>
							<div className="w-full flex justify-between">
								<button
									style={{ visibility: formState < 1 ? "hidden" : "visible" }}
									className="button-bordered"
									onClick={() => setFormState(formState > 0 ? formState - 1 : 0)}
								>
									<ArrowLeftIcon /> Previous
								</button>
								{formState < 1 ? (
									<button
										className="button-t1"
										onClick={handleNextClick}
										disabled={
											formState === 0 &&
											(deploymentForm.deployment_name === "" || deploymentForm.gpu === "")
												? true
												: false
										}
									>
										Next <ArrowRightIcon />
									</button>
								) : (
									<button className="button-t1" onClick={() => void handleDeploy()}>
										Finetune
									</button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
			<div
				className="absolute top-0 left-0 w-full h-full bg-black-900 opacity-40 z-0"
				onClick={() => modalDeployForm(false)}
			></div>
		</div>
	)
}

export default DeployForm
