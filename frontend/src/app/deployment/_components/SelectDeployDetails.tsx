"use client"

import { Info } from "lucide-react"
import { Tooltip } from "react-tooltip"
import { useRecoilState } from "recoil"

import { deploymentFormAtom } from "@/utils/atoms"

const SelectDeployDetails = () => {
	const [formData, setFormData] = useRecoilState(deploymentFormAtom)

	const handleFormChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
			| React.ChangeEvent<HTMLSelectElement>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	return (
		<div className="h-[50vh] w-full flex gap-4 overflow-y-scroll">
			<div className="w-full">
				<div className="relative">
					<label htmlFor="deployment_name" className=" peer">
						Deployment Name <span style={{ color: "red" }}>*</span>{" "}
						<a className="deployment_name">
							<Info size={15} />
						</a>
						<Tooltip
							anchorSelect=".deployment_name"
							place="bottom"
							style={{ zIndex: 1, opacity: 1 }}
						>
							<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
								Unique Name for the deployment
							</div>
						</Tooltip>
					</label>
					<input
						type="text"
						name="deployment_name"
						placeholder="Name"
						onChange={handleFormChange}
						value={formData.deployment_name}
					/>
					<span className="absolute invisible peer-hover:visible right-0 top-0 text-xs transition-all delay-100 ease-linear opacity-25">
						Mandatory Field
					</span>
				</div>
				
				<label htmlFor="select_gpu">
					Select GPU <span style={{ color: "red" }}>*</span>{" "}
					<a className="select_gpu">
						<Info size={15} />
					</a>
					<Tooltip anchorSelect=".select_gpu" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
						<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>GPU to run Inference</div>
					</Tooltip>
				</label>
				<div>
					<div className="select ">
						<select name="gpu" onChange={handleFormChange} value={formData.gpu}>
							<option value="">Select GPU</option>
							<option value="l4">L4 24GB</option>
							<option value="a10">A10 24GB</option>
							<option value="a100">A100 40GB</option>
							<option value="a100_80">A100 80GB</option>
						</select>
					</div>
					<span className="absolute invisible peer-hover:visible right-0 top-0 text-xs transition-all delay-100 ease-linear opacity-25">
						Mandatory Field
					</span>
				</div>
				<div className="relative">
					<label htmlFor="select_server" className="peer">
						Select server{" "}
						<a className="select_server">
							<Info size={15} />
						</a>
						<Tooltip anchorSelect=".select_server" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
							<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
								Select appropriate server from the given options.
							</div>
						</Tooltip>
					</label>
					<div className="select ">
						<select
							name="select_server"
							onChange={handleFormChange}
							value={formData.server}
						>
							<option value="vllm">vllm</option>
							<option value="tgi">tgi</option>
							<option value="triton">triton</option>
						</select>
					</div>
				</div>
				<div className="relative">
					<label htmlFor="model_type" className="peer">
						Model Type{" "}
						<a className="model_type">
							<Info size={15} />
						</a>
						<Tooltip anchorSelect=".model_type" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
							<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
								Select the model type for deployment
							</div>
						</Tooltip>
					</label>
					<div className="select">
						<select name="model_type" disabled>
							<option value="text-generation">Text Generation</option>
						</select>
					</div>
				</div>
			</div>
			<div className="w-full">
			<div className="relative">
					<label htmlFor="model_id" className="peer">
						Model ID <span style={{ color: "red" }}>*</span>
						<a className="model_id">
							<Info size={15} />
						</a>
						<Tooltip anchorSelect=".model_id" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
							<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
								Provide the model id from huggingface to deploy
							</div>
						</Tooltip>
					</label>
					<input type="text" name="model_id" placeholder="ID" onChange={handleFormChange} />
					<span className="absolute invisible peer-hover:visible right-0 top-0 text-xs transition-all delay-100 ease-linear opacity-25">
						Mandatory Field
					</span>
				</div>
				<div className="relative">
					<label htmlFor="max_containers" className="peer">
						Containers{" "}
						<a className="max_containers">
							<Info size={15} />
						</a>
						<Tooltip
							anchorSelect=".max_containers"
							place="bottom"
							style={{ zIndex: 1, opacity: 1 }}
						>
							<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
								Maximum server/container to run at any given point.
							</div>
						</Tooltip>
					</label>
					<div className="select">
						<select
							name="containers"
							onChange={handleFormChange}
							value={formData.containers}
						>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
						</select>
					</div>
				</div>
				<label htmlFor="description">
					Model Detail
					<a className="model_detail">
						<Info size={15} />
					</a>
					<Tooltip anchorSelect=".model_detail" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
						<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
							Provide short Description for deployment
						</div>
					</Tooltip>
				</label>
				<textarea
					rows={5}
					name="description"
					placeholder="Provide Model Description"
					value={formData.description}
					onChange={handleFormChange}
					className="resize-none"
				/>
			</div>
		</div>
	)
}

export default SelectDeployDetails
