"use client"

import { Info } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Tooltip } from "react-tooltip"
import { useRecoilValue } from "recoil"

import styles from "@/styles/Finetuning/Finetuning.module.css"
import { fineTuningFormAtom } from "@/utils/atoms"

import arrow_up from "../../../../public/arrow_up.svg"

export default function FormPage4() {
	const [advanceOptionDisplay, setAdvanceOptionDisplay] = useState("none")
	const finetuning = useRecoilValue(fineTuningFormAtom)

	return (
		<>
			<div className="h-[56vh] w-full flex flex-col gap-4 overflow-y-scroll py-4 ">
				<div className="flex flex-row gap-4">
					<div className="w-full">
						<div className="relative ">
							<label htmlFor="pipeline_name" className="peer">
								Pipeline Name{" "}
								<a className="pipeline_name">
									<Info size={15} />
								</a>
								<Tooltip
									anchorSelect=".pipeline_name"
									place="bottom"
									style={{ zIndex: 1, opacity: 1 }}
								>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Provide unique name for this finetuning pipeline
									</div>
								</Tooltip>
							</label>
							<input
								name="pipeline_name"
								type="text"
								placeholder="Pipeline Name"
								readOnly={true}
								value={finetuning.pipeline_name}
								width="25rem"
							/>
							<span className="absolute invisible peer-hover:visible right-0 top-0 text-xs transition-all delay-100 ease-linear opacity-25">
								Mandatory Field
							</span>
						</div>
						<div className="relative ">
							<label htmlFor={"Finetuning Method"}>
								Finetuning Method
								<a className="finetuning_method">
									<Info size={15} />
								</a>
								<Tooltip
									anchorSelect=".finetuning_method"
									place="bottom"
									style={{ zIndex: 1, opacity: 1 }}
								>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Select the method for finetuning the model
									</div>
								</Tooltip>
							</label>
							<input
								name="finetuning_method"
								value={finetuning.finetuning_method}
								type="string"
								readOnly={true}
								width="25rem"
							/>
						</div>
						<div className="">
							<label htmlFor={"gpu"}>
								GPU
								<a className="gpu">
									<Info size={15} />
								</a>
								<Tooltip anchorSelect=".gpu" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Select the GPU to run the finetuning process on
									</div>
								</Tooltip>
							</label>
							<input
								name="gpu"
								type="string"
								placeholder="Select gpu"
								readOnly={true}
								value={finetuning.gpu}
								width="25rem"
							/>
						</div>
						<div className="">
							<label htmlFor="batch_size" className="peer">
								Batch size
								<a className="batch_size">
									<Info size={15} />
								</a>
								<Tooltip
									anchorSelect=".batch_size"
									place="bottom"
									style={{ zIndex: 1, opacity: 1 }}
								>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Batch Size for training
									</div>
								</Tooltip>
							</label>
							<input
								name="batch_size"
								type="number"
								placeholder="0"
								readOnly={true}
								value={finetuning.batch_size}
								width="25rem"
							/>
						</div>
						<div>
							<label htmlFor={"deploy"}>
								Upload Model To Hugging Face
								<a className="upload_model">
									<Info size={15} />
								</a>
								<Tooltip
									anchorSelect=".upload_model"
									place="bottom"
									style={{ zIndex: 1, opacity: 1 }}
								>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Enables this opton to push model to HF repository after training
									</div>
								</Tooltip>
							</label>
							<input
								type="checkbox"
								name="upload_model_to_hf"
								id="upload_model_to_hf"
								checked={finetuning.upload_model_to_hf}
								style={{ width: "max-content" }}
							/>
						</div>
					</div>
					<div className="w-full">
						<div className="relative">
							<label htmlFor={"model"} className="peer">
								Model
								<a className="model">
									<Info size={15} />
								</a>
								<Tooltip anchorSelect=".model" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Select the base model to finetune
									</div>
								</Tooltip>
							</label>
							<input
								name="model"
								value={finetuning.model}
								type="string"
								readOnly={true}
								width="25rem"
							/>

							<span className="absolute invisible peer-hover:visible right-0 top-0 text-xs transition-all delay-100 ease-linear opacity-25">
								Mandatory Field
							</span>
						</div>
						<div className="relative ">
							<label htmlFor={"optimizer"}>
								Optimizer
								<a className="optimizer">
									<Info size={15} />
								</a>
								<Tooltip anchorSelect=".optimizer" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Select the Optimizer to use
									</div>
								</Tooltip>
							</label>
							<input
								name="optimizer"
								value={finetuning.optimizer}
								type="string"
								readOnly={true}
								width="25rem"
							/>
						</div>
						<div className="">
							<label htmlFor="Num_epochs" className="peer">
								Num epochs
								<a className="Num_epochs">
									<Info size={15} />
								</a>
								<Tooltip
									anchorSelect=".Num_epochs"
									place="bottom"
									style={{ zIndex: 1, opacity: 1 }}
								>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Total number of training epochs to perform.
									</div>
								</Tooltip>
							</label>
							<input
								name="num_epochs"
								type="number"
								placeholder="0"
								readOnly={true}
								value={finetuning.num_epochs}
								width="25rem"
							/>
						</div>
						<div className="">
							<label htmlFor="LR" className="peer">
								LR
								<a className="LR">
									<Info size={15} />
								</a>
								<Tooltip anchorSelect=".LR" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Provide the learning rate for the model training
									</div>
								</Tooltip>
							</label>
							<input
								name="lr"
								type="number"
								placeholder="0"
								readOnly={true}
								value={finetuning.lr}
								width="25rem"
							/>
						</div>
						<div>
							{finetuning.upload_model_to_hf === true && (
								<>
									<div className="relative ">
										<label htmlFor="hf_id" className="peer">
											HuggingFace ID
											<a className="hf_id">
												<Info size={15} />
											</a>
											<Tooltip
												anchorSelect=".hf_id"
												place="bottom"
												style={{ zIndex: 1, opacity: 1 }}
											>
												<div
													style={{
														maxWidth: "20rem",
														wordWrap: "break-word",
													}}
												>
													This is HuggingFace ID
												</div>
											</Tooltip>
										</label>
										<input name="hf_id" type="string" readOnly={true} value={finetuning.hf_id} />
									</div>
								</>
							)}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div
						onClick={() => {
							setAdvanceOptionDisplay(advanceOptionDisplay === "block" ? "none" : "block")
						}}
						className={`flex flex-row justify-between items-center w-max space-x-4 mb-4`}
					>
						<div className="font-bold">Advance Option</div>
						<div className={`${advanceOptionDisplay === "block" ? "" : styles.rotateDivVertical}`}>
							<Image
								src={arrow_up.src} // eslint-disable-line
								width={"100"}
								height={"100"}
								alt="arrow_up"
								className="w-full"
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-row gap-4">
					{advanceOptionDisplay === "block" && (
						<>
							<div className="flex w-full gap-4">
								<div className="w-full">
									<div className="relative ">
										<label htmlFor="Lora_alpha" className="peer">
											Lora alpha
											<a className="Lora_alpha">
												<Info size={15} />
											</a>
											<Tooltip
												anchorSelect=".Lora_alpha"
												place="bottom"
												style={{ zIndex: 1, opacity: 1 }}
											>
												<div
													style={{
														maxWidth: "20rem",
														wordWrap: "break-word",
													}}
												>
													This is Lora Alpha
												</div>
											</Tooltip>
										</label>
										<input
											name="lora_alpha"
											type="number"
											placeholder="0"
											readOnly={true}
											value={finetuning.lora_alpha}
											width="25rem"
										/>
									</div>
									<div className="relative ">
										<label htmlFor="Lora_Dropout" className="peer">
											Lora Dropout
											<a className="Lora_Dropout">
												<Info size={15} />
											</a>
											<Tooltip
												anchorSelect=".Lora_Dropout"
												place="bottom"
												style={{ zIndex: 1, opacity: 1 }}
											>
												<div
													style={{
														maxWidth: "20rem",
														wordWrap: "break-word",
													}}
												>
													This is Lora Dropout
												</div>
											</Tooltip>
										</label>
										<input
											name="lora_dropout"
											type="number"
											placeholder="0"
											readOnly={true}
											value={finetuning.lora_dropout}
											width="25rem"
										/>
									</div>
								</div>
								<div className="w-full">
									<div className="relative">
										<label htmlFor="Lora_R" className="peer">
											Lora R
											<a className="Lora_R">
												<Info size={15} />
											</a>
											<Tooltip
												anchorSelect=".Lora_R"
												place="bottom"
												style={{ zIndex: 1, opacity: 1 }}
											>
												<div
													style={{
														maxWidth: "20rem",
														wordWrap: "break-word",
													}}
												>
													This is Lora R
												</div>
											</Tooltip>
										</label>
										<input
											name="lora_r"
											type="number"
											placeholder="0"
											readOnly={true}
											value={finetuning.lora_r}
											width="25rem"
										/>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	)
}
