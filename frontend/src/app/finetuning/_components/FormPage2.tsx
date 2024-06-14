import { Info } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Tooltip } from "react-tooltip"
import { useRecoilValue, useSetRecoilState } from "recoil"

import styles from "@/styles/Finetuning/Finetuning.module.css"
import { fineTuningFormAtom } from "@/utils/atoms"

import arrow_up from "../../../../public/arrow_up.svg"

export default function FormPage2() {
	const finetuningModelFormData = useSetRecoilState(fineTuningFormAtom)
	const finetuning = useRecoilValue(fineTuningFormAtom) // eslint-disable-next-line

	const [advanceOptionDisplay, setAdvanceOptionDisplay] = useState("none")

	const handleChange = (event: any) => {
		if (
			event.target.name === "upload_model_to_hf" || // eslint-disable-line
			event.target.name === "reduce_batch_size" // eslint-disable-line
		) {
			finetuningModelFormData((prevState) => {
				return {
					...prevState,
					[event.target.name]: event.target.checked, // eslint-disable-line
				}
			})
		} else {
			console.log("name", event.target.name)
			console.log("value", event.target.value)

			finetuningModelFormData((prevState) => {
				return {
					...prevState,
					[event.target.name]: event.target.value, // eslint-disable-line
				}
			})
		}
	}
	return (
		<>
			<div className="h-[56vh] w-full flex flex-col gap-4 overflow-y-scroll x-4">
				<div className="flex flex-row gap-4">
					<div className="w-full">
						<div className="relative ">
							<label htmlFor="pipeline_name" className="peer">
								Pipeline Name <span style={{ color: "red" }}>*</span>{" "}
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
								onChange={handleChange}
								readOnly={false}
								value={finetuning.pipeline_name}
								width="25rem"
							/>
							<span className="absolute invisible peer-hover:visible right-0 top-0 text-xs transition-all delay-100 ease-linear opacity-25">
								Mandatory Field
							</span>
						</div>
						<div className="relative ">
							<label htmlFor={"Finetuning Method"}>
								Finetuning Method <span style={{ color: "red" }}>*</span>
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
							<div className="select">
								<select
									name="finetuning_method"
									value={finetuning.finetuning_method}
									onChange={handleChange}
									id=""
								>
									<option>Select Finetuning Method</option>
									<option value="lora_16bit">lora_16bit</option>
									<option value="lora_8bit">lora_8bit</option>
									<option value="qlora_4bit">qlora_4bit</option>
								</select>
							</div>
						</div>
						<div className="">
							<label htmlFor={"gpu"}>
								GPU <span style={{ color: "red" }}>*</span>
								<a className="gpu">
									<Info size={15} />
								</a>
								<Tooltip anchorSelect=".gpu" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Select the GPU to run the finetuning process on
									</div>
								</Tooltip>
							</label>
							<div className="select">
								<select name="gpu" onChange={handleChange} id="">
									<option value="">Select GPU</option>
									<option value="a100">A100 40GB</option>
									<option value="a100_80">A100 80GB</option>
								</select>
							</div>
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
								onChange={handleChange}
								readOnly={false}
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
								onChange={handleChange}
								style={{ width: "max-content" }}
							/>
						</div>
					</div>
					<div className="w-full">
						<div className="relative">
							<label htmlFor={"model"} className="peer">
								Model ID <span style={{ color: "red" }}>*</span>
								<a className="model">
									<Info size={15} />
								</a>
								<Tooltip anchorSelect=".model" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Provide the model id from huggingface to finetune
									</div>
								</Tooltip>
							</label>
							<input
								name="model"
								type="text"
								placeholder="HF Model Id"
								onChange={handleChange}
								readOnly={false}
								value={finetuning.model}
								width="25rem"
							/>
							<span className="absolute invisible peer-hover:visible right-0 top-0 text-xs transition-all delay-100 ease-linear opacity-25">
								Mandatory Field
							</span>
						</div>
						<div className="relative ">
							<label htmlFor={"optimizer"}>
								Optimizer <span style={{ color: "red" }}>*</span>
								<a className="optimizer">
									<Info size={15} />
								</a>
								<Tooltip anchorSelect=".optimizer" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
									<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
										Select the Optimizer to use
									</div>
								</Tooltip>
							</label>
							<div className="select">
								<select name="optimizer" onChange={handleChange} id="">
									<option value="">Select Optimizer</option>
									<option value="adamw_hf">adamw_hf</option>
									<option value="adamw_torch">adamw_torch</option>
									<option value="adamw_torch_fused">adamw_torch_fused</option>
									<option value="adamw_torch_xla">adamw_torch_xla</option>
									<option value="adamw_torch_npu_fused">adamw_torch_npu_fused</option>
									<option value="adamw_apex_fused">adamw_apex_fused</option>
									<option value="adafactor">adafactor</option>
									<option value="adamw_anyprecision">adamw_anyprecision</option>
									<option value="sgd">sgd</option>
									<option value="adagrad">adagrad</option>
									<option value="adamw_bnb_8bit">adamw_bnb_8bit</option>
									<option value="lion_8bit">lion_8bit</option>
									<option value="lion_32bit">lion_32bit</option>
									<option value="paged_adamw_32bit">paged_adamw_32bit</option>
									<option value="paged_adamw_8bit">paged_adamw_8bit</option>
									<option value="paged_lion_32bit">paged_lion_32bit</option>
									<option value="rmsprop">rmsprop</option>
								</select>
							</div>
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
								onChange={handleChange}
								readOnly={false}
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
								onChange={handleChange}
								readOnly={false}
								value={finetuning.lr}
								width="25rem"
							/>
						</div>
						<div>
							{finetuning.upload_model_to_hf === true && (
								<>
									<div className="relative ">
										<label htmlFor="hf_id" className="peer">
											HuggingFace ID <span style={{ color: "red" }}>*</span>
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
										<input
											name="hf_id"
											type="text"
											placeholder="HuggingFace ID"
											onChange={handleChange}
											readOnly={false}
											value={finetuning.hf_id}
										/>
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
											onChange={handleChange}
											readOnly={false}
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
											onChange={handleChange}
											readOnly={false}
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
											onChange={handleChange}
											readOnly={false}
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
