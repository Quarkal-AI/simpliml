"use client"

import { ArrowLeftIcon, ArrowRightIcon, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useRecoilValue } from "recoil"

import API from "@/API/API"
import CustomizableButton from "@/components/Button/CustomizableButton"
import Loader from "@/components/Loader"
import { deploymentFormAtom, platformAtom } from "@/utils/atoms"
import { errorHandler } from "@/utils/errorHandler"

import ReviewDeployDetails from "./ReviewDeployDetails"
import SelectDeployDetails from "./SelectDeployDetails"
import SelectPlatform from "./SelectPlatform"

const ModalForm = ({ modalOpen }: { modalOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const router = useRouter()

	const [formState, setFormState] = useState<number>(0)
	const [loading, setLoading] = useState(false)
	const formData = useRecoilValue(deploymentFormAtom)
	const platform = useRecoilValue(platformAtom)

	const handleNextClick = () => {
		try {
			if (formState == 0 && platform.platform !== "") {
				setFormState(formState + 1)
			} else if (formState === 1 && formData.deployment_name !== "" && formData.model_id !== "") {
				setFormState(formState + 1)
			} else if (formState < 1) {
				setFormState(formState + 1)
			} else {
				setFormState(formState + 1)
			}
		} catch (error) {
			console.error("Error handling next click:", error)
		}
	}
	const handlePreviousClick = () => {
		setFormState(formState > 0 ? formState - 1 : 0)
	}

	const handleDeploy = async () => {
		try {
			setLoading(true)
			await API.post("/deployment/create", formData)
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
			<div className="z-[99] fixed min-h-[40vh] h-content left-1/2 -translate-x-1/2 w-1/2 top-[5vh] flex flex-col  rounded-xl border border-white bg-black-900 overflow-clip">
				<div className="relative p-4 flex items-center justify-center text-center back-gradient">
					<h3>Deploy Model</h3>
					<X className="absolute right-4 cursor-pointer" onClick={() => modalOpen(false)} />
				</div>
				{loading ? (
					<Loader />
				) : (
					<div className="py-4 px-8 flex flex-col items-center justify-between gap-4">
						<div className="flex justify-evenly">
							{[1, 2, 3].map((item, index) => {
								return (
									<div className="flex items-center w-full" key={index}>
										<div
											className={
												formState >= index
													? "rounded-full flex items-center justify-center back-gradient h-9 w-9"
													: "rounded-full  flex items-center justify-center border border-gray-500 h-9 w-9"
											}
										>
											{item}
										</div>
										{index < 2 && (
											// lines between
											<div className="border-t w-20 h-0 opacity-20"></div>
										)}
									</div>
								)
							})}
						</div>
						{formState == 0 && <h3>Select Platform to Deploy Model From</h3>}
						{formState == 1 && <h3>Enter Deployment Details</h3>}
						{formState == 2 && <h3>Review</h3>}

						{formState == 0 && <SelectPlatform />}
						{formState == 1 && <SelectDeployDetails />}
						{formState == 2 && <ReviewDeployDetails />}
						<div className="w-full flex justify-between">
							<CustomizableButton
								className={`button-bordered  ${formState === 0 ? "invisible" : "visible"} `}
								onClick={() => handlePreviousClick()}
							>
								<ArrowLeftIcon /> Previous
							</CustomizableButton>
							{formState < 2 ? (
								<CustomizableButton
									className="button-t1"
									onClick={() => void handleNextClick()}
									disabled={
										(formState == 0 && platform.platform === "") ||
										(formState === 1 &&
											(formData.deployment_name === "" || formData.model_id === ""))
									}
								>
									Next <ArrowRightIcon />
								</CustomizableButton>
							) : (
								<CustomizableButton className="button-t1" onClick={() => void handleDeploy()}>
									Deploy
								</CustomizableButton>
							)}
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
