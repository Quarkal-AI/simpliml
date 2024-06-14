"use client"

import { ArrowLeftIcon, ArrowRightIcon, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useRecoilValue } from "recoil"

import API from "@/API/API"
import Button from "@/components/Button/Button"
import CustomizableButton from "@/components/Button/CustomizableButton"
import Loader from "@/components/Loader"
import { datasetFormAtom, deploymentFormAtom, fineTuningFormAtom } from "@/utils/atoms"
import { errorHandler } from "@/utils/errorHandler"

import FormPage1 from "./FormPage1"
import FormPage2 from "./FormPage2"
import FormPage4 from "./FormPage4"

const ModalForm = ({ modalOpen }: { modalOpen: React.Dispatch<React.SetStateAction<boolean>>, usage?: string }) => {
	const router = useRouter()

	const datasetForm = useRecoilValue(datasetFormAtom)
	const finetuningModelFormData = useRecoilValue(fineTuningFormAtom)
	const deploymentForm = useRecoilValue(deploymentFormAtom)

	const [formState, setFormState] = useState<number>(0)
	const [loading, setLoading] = useState(false)

	const handleNextClick = () => {
		if (formState === 0 && (datasetForm.file !== null || datasetForm.dataset_id !== "")) {
			setFormState(formState + 1)
		} else if (
			formState === 1 &&
			finetuningModelFormData.model !== "" &&
			finetuningModelFormData.gpu !== "" &&
			finetuningModelFormData.finetuning_method !== ""
		) {
			setFormState(formState + 1)
		} else {
			setFormState(formState + 1)
		}
	}

	const getButtonClassName = () => {
		if (formState === 0) {
			if (datasetForm.file !== null || datasetForm.dataset_id !== "") {
				return "button-t1 "
			} else {
				return "button-bordered disabled"
			}
		} else if (formState === 1) {
			if (
				finetuningModelFormData.model !== "" &&
				finetuningModelFormData.gpu !== "" &&
				finetuningModelFormData.finetuning_method !== "" &&
				finetuningModelFormData.pipeline_name !== "" &&
				finetuningModelFormData.optimizer !== ""
			) {
				return "button-t1"
			} else {
				return "button-bordered"
			}
		} else if (formState === 2) {
			return "button-t1"
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

			console.log(finetuningModelFormData)
			console.log(deploymentForm)

			await API.post("/finetuning/create", {
				...finetuningModelFormData,
				dataset_id: datasetForm.dataset_id,
			})
			setLoading(false)
			modalOpen(false)
			window.location.reload()
		} catch (error: unknown) {
			errorHandler(error, router)
		} finally {
			setLoading(false)
			modalOpen(false)
		}
	}

	return (
		<div className="">
			{/* <div className="z-[99] fixed left-1/2 -translate-x-1/2 w-[58rem] top-[5vh] flex flex-col rounded-xl border border-white bg-black-900 overflow-clip"> */}
			<div
				// className="z-[99] fixed min-h-[40vh] h-content left-1/2 -translate-x-1/2 w-1/2 top-[5vh] flex flex-col  rounded-xl border border-white bg-black-900 overflow-clip"
				className="z-[99] fixed min-h-[40vh] h-content left-1/2 -translate-x-1/2 w-1/2 top-[5vh] flex flex-col  rounded-xl border border-white bg-black-900 overflow-clip"
			>
				<div className="relative p-4 flex items-center justify-center text-center back-gradient">
					<h3>Create</h3>
					<X className="absolute right-4 cursor-pointer" onClick={() => modalOpen(false)} />
				</div>
				{loading ? (
					<Loader />
				) : (
					<div>
						<div className="py-4 px-12 flex flex-col items-center justify-between gap-4">
							<div className="flex justify-evenly">
								{[1, 2, 3].map((item, index) => {
									return (
										<div className="flex items-center w-full" key={index}>
											<div
												className={
													formState >= index
														? "rounded-full flex items-center justify-center back-gradient w-8 h-8 "
														: "rounded-full flex items-center justify-center border border-gray-500 w-8 h-8"
												}
											>
												{item}
											</div>
											{index < 2 && <div className="border-t w-20 h-0 opacity-20"></div>}
										</div>
									)
								})}
							</div>

							{formState == 0 && (
								<h3 className="text-center py-2">
									Upload Your Dataset Or Mention The HF Dataset ID{" "}
								</h3>
							)}
							{formState == 0 && <FormPage1 />}
							{formState == 1 && <FormPage2 />}
							{/* {formState == 2 && <FormPage3 readOnly={false} usage={usage} />} */}
							{formState == 2 && <FormPage4 />}

							<div className="w-full flex justify-between">
								<CustomizableButton
									className={`button-bordered ${formState < 1 ? "invisible" : "visible"}`}
									onClick={() => setFormState(formState > 0 ? formState - 1 : 0)}
								>
									<ArrowLeftIcon /> Previous
								</CustomizableButton>
								{formState < 2 ? (
									<CustomizableButton
										className={getButtonClassName()}
										onClick={handleNextClick}
										disabled={
											(formState == 0 && datasetForm.dataset_id == "") ||
											(formState === 1 &&
												(finetuningModelFormData.model === "" ||
													finetuningModelFormData.gpu === "" ||
													finetuningModelFormData.finetuning_method === "" ||
													finetuningModelFormData.pipeline_name === "" ||
													finetuningModelFormData.optimizer === "" ||
													(finetuningModelFormData.upload_model_to_hf === true &&
														(finetuningModelFormData.hf_id === "" ||
															finetuningModelFormData.hf_id === undefined))))
										}
									>
										Next <ArrowRightIcon />
									</CustomizableButton>
								) : (
									<Button className="button-t1" onClick={() => void handleDeploy()}>
										Finetune
									</Button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
			<div
				className="absolute top-0 left-0 w-full h-full bg-black-900 opacity-40 z-0"
				onClick={() => modalOpen(false)}
			></div>
		</div>
	)
}

export default ModalForm
