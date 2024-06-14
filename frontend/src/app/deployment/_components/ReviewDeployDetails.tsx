"use client"

import { Info } from "lucide-react"
import { Tooltip } from "react-tooltip"
import { useRecoilValue } from "recoil"

import { deploymentFormAtom } from "@/utils/atoms"

const ReviewDeployDetails = () => {
	const formData = useRecoilValue(deploymentFormAtom)

	return (
		<div className="h-[50vh] w-full flex gap-4 overflow-y-scroll">
			<div className="w-full">
				<label htmlFor="deployment_name">
					Deployment Name{" "}
					<a className="deployment_name">
						<Info size={15} />
					</a>
					<Tooltip anchorSelect=".deployment_name" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
						<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
							Unique Name for the deployment
						</div>
					</Tooltip>
				</label>
				<input
					type="text"
					name="deployment_name"
					placeholder="Name"
					disabled
					value={formData.deployment_name}
				/>
				<label htmlFor="select_gpu">
					Select GPU{" "}
					<a className="select_gpu">
						<Info size={15} />
					</a>
					<Tooltip anchorSelect=".select_gpu" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
						<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>GPU to run Inference</div>
					</Tooltip>
				</label>
				<div>
					<div className="select">
						<select name="select_gpu" disabled value={formData.gpu}>
							<option value="">Select GPU</option>
							<option value="l4">L4 24GB</option>
							<option value="a10">A10 24GB</option>
							<option value="a100">A100 40GB</option>
							<option value="a100_80">A100 80GB</option>
						</select>
					</div>
				</div>
				<label htmlFor="model_type">
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
			<div className="w-full">
				<label htmlFor="model_id">
					Model ID
					<a className="model_id">
						<Info size={15} />
					</a>
					<Tooltip anchorSelect=".model_id" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
						<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
							Provide the model id from huggingface to deploy
						</div>
					</Tooltip>
				</label>
				<input type="text" name="model_id" placeholder="ID" disabled value={formData.model_id} />

				<label htmlFor="max_containers">
					Containers{" "}
					<a className="max_containers">
						<Info size={15} />
					</a>
					<Tooltip anchorSelect=".max_containers" place="bottom" style={{ zIndex: 1, opacity: 1 }}>
						<div style={{ maxWidth: "20rem", wordWrap: "break-word" }}>
							Maximum server/container to run at any given point.
						</div>
					</Tooltip>
				</label>
				<div className="select">
					<select
						name="max_containers"
						disabled
						value={formData.containers}
					>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
					</select>
				</div>

				<label htmlFor="description">
					Model Detail{" "}
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
					disabled
					value={formData.description}
					className="resize-none"
				/>
			</div>
			<Tooltip id="my-tooltip" />
		</div>
	)
}

export default ReviewDeployDetails
