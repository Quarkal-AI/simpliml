// import { SetterOrUpdater } from "recoil"
import React from "react"
import { SetterOrUpdater } from "recoil"

import { Rowtypes } from "@/types/index.d"

import Row from "./Row"

interface finetuningModalFormData {
	pipeline_name: string
	num_epochs: number
	lr: number
	batch_size: number
	lora_alpha: number
	lora_r: number
	lora_dropout: number
	model: string
	finetuning_method: string
	gpu: string
	optimizer: string
	upload_model_to_hf: boolean
}
interface Quota {
	name: string
	quota: number
	current_usage_value: number
	current_usage_percentage: number
}

interface props {
	from: string
	tableWidth: string
	columns: { name: string }[]
	rows: Rowtypes[]
	setFinetuningModelFormData?: SetterOrUpdater<finetuningModalFormData>
	setPipelineId?: React.Dispatch<React.SetStateAction<string>>
	setPopupDisplay?: React.Dispatch<React.SetStateAction<string>>
	setModalDeployForm?: React.Dispatch<React.SetStateAction<boolean>>
	setDeleteUserList?: React.Dispatch<React.SetStateAction<string[]>>
	setShowHideEditModal?: React.Dispatch<React.SetStateAction<boolean>>
	setEditUser?: React.Dispatch<React.SetStateAction<string>>
	setDeleteModalList?: React.Dispatch<React.SetStateAction<string[]>>
	setDeleteFinetuningList?: React.Dispatch<React.SetStateAction<string[]>>
	setEditInstanceModal?: React.Dispatch<React.SetStateAction<boolean>>
	setSelectedRowList?: SetterOrUpdater<Quota[]>
}
export default function Table({
	from,
	tableWidth,
	columns,
	rows,
	setPipelineId,
	setFinetuningModelFormData,
	setPopupDisplay,
	setEditUser,
	setDeleteUserList,
	setShowHideEditModal,
	setModalDeployForm,
	setDeleteModalList,
	setDeleteFinetuningList,
	setSelectedRowList,
	setEditInstanceModal,
}: props) {
	const padding = "0.75rem 0rem 0.75rem 2rem"
	return (
		<table style={{ width: tableWidth }}>
			<thead>
				<tr
					style={{
						background: "linear-gradient(to right, #1440b5, #00aaf0)",
						borderBottom: "1px solid white",
						textAlign: "left",
					}}
				>
					{columns.map((column, index) => (
						<th key={index} style={{ padding: padding }}>
							{column.name}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, index) => (
					<Row
						from={from}
						key={index}
						index={index}
						link={row.link}
						checkbox={row.checkbox}
						row={row.value}
						user_id={row.user_id}
						modal_id={row.model_id}
						pipeline_id={row.pipeline_id}
						name={row.name}
						padding={padding}
						setPipelineId={setPipelineId}
						setPopupDisplay={setPopupDisplay}
						setModalDeployForm={setModalDeployForm}
						setFinetuningModelFormData={setFinetuningModelFormData}
						setShowHideEditModal={setShowHideEditModal}
						setDeleteUserList={setDeleteUserList}
						setEditUser={setEditUser}
						setEditInstanceModal={setEditInstanceModal}
						setDeleteModalList={setDeleteModalList}
						setSelectedRowList={setSelectedRowList}
						setDeleteFinetuningList={setDeleteFinetuningList}
					/>
				))}
			</tbody>
		</table>
	)
}
