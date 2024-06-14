import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { SetterOrUpdater, useSetRecoilState } from "recoil"

import { deleteConfirmationAtom, editInstanceAtom, editModalAtom } from "@/utils/atoms"

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
	index: number
	link?: string
	greendot?: boolean
	checkbox?: boolean
	row: Array<string | { type: string; value: string; stopPropogation: boolean }>
	user_id?: string
	pipeline_id?: string
	name?: string
	modal_id?: string
	padding: string
	editButton?: boolean
	deleteButton?: string
	threeDots?: boolean
	setFinetuningModelFormData?: SetterOrUpdater<finetuningModalFormData>
	setPipelineId?: React.Dispatch<React.SetStateAction<string>>
	setPopupDisplay?: React.Dispatch<React.SetStateAction<string>>
	setEditUser?: React.Dispatch<React.SetStateAction<string>>
	setDeleteUserList?: React.Dispatch<React.SetStateAction<string[]>>
	setModalDeployForm?: React.Dispatch<React.SetStateAction<boolean>>
	setShowHideEditModal?: React.Dispatch<React.SetStateAction<boolean>>
	setDeleteModalList?: React.Dispatch<React.SetStateAction<string[]>>
	setDeleteFinetuningList?: React.Dispatch<React.SetStateAction<string[]>>
	setEditInstanceModal?: React.Dispatch<React.SetStateAction<boolean>>
	setSelectedRowList?: SetterOrUpdater<Quota[]>
}
export default function Row({
	from,
	link,
	checkbox,
	row,
	pipeline_id,
	user_id,
	modal_id,
	padding,
	setPipelineId,
	setEditUser,
	setPopupDisplay,
	setDeleteUserList,
	setModalDeployForm,
	setFinetuningModelFormData,
	setShowHideEditModal,
	setDeleteFinetuningList,
	setDeleteModalList,
	setSelectedRowList,
	setEditInstanceModal,
}: props) {
	const [displayDeleteButton, setDisplayDeleteButton] = useState(false)
	const setDeleteModal = useSetRecoilState(deleteConfirmationAtom)
	const setDeleteFinetuning = useSetRecoilState(deleteConfirmationAtom)
	const borderBottom = "1px solid rgba(255, 255, 255, 0.2)"
	const editDeploymentModal = useSetRecoilState(editModalAtom)
	const editInstanceModal = useSetRecoilState(editInstanceAtom)
	const router = useRouter()

	const handleRowClick = () => {
		if (from === "finetuning" && setPopupDisplay && setPipelineId) {
			setPipelineId(typeof row[1] === "string" ? row[1] : "")
			setPopupDisplay("block")
		}
		if (from === "models" && link) {
			router.push(link)
		}
		if (from === "deployment" && link) {
			if (row[2] !== "Deploying") {
				router.push(link)
			}
		}
	}

	const handleClick = (data: { type: string; value: string }) => {
		if (
			from === "finetuning" &&
			data.type === "handleDeploy" &&
			setModalDeployForm &&
			setPipelineId &&
			setFinetuningModelFormData
		) {
			setPipelineId(typeof row[1] === "string" ? row[1] : "")
			setModalDeployForm(true)
			setFinetuningModelFormData((prevState: finetuningModalFormData): finetuningModalFormData => {
				return {
					...prevState,
				}
			})
		}
		if (from === "finetuning" && data.type === "handleDelete") {
			setDisplayDeleteButton(true)
		}
		if (from === "deployment" && data.type === "startStopStatus" && setEditInstanceModal) {
			if (modal_id && typeof row[2] === "string" && setEditInstanceModal) {
				setEditInstanceModal(true)
				editInstanceModal({
					id: modal_id,
					show: true,
					state: row[2],
				})
			}
		}

		if (data.type === "handleEdit") {
			if (from === "admin" && setShowHideEditModal && setEditUser && user_id) {
				setEditUser(user_id)
				setShowHideEditModal(true)
			}
			if (from === "deployment" && modal_id) {
				if (row[2] !== "Deploying") {
					editDeploymentModal({
						id: modal_id,
						show: true,
					})
				}
			}
		}
	}

	const handleCheckbox = () => {
		if (from === "admin" && setDeleteUserList && user_id) {
			setDeleteUserList((prev) => {
				if (prev.includes(user_id)) {
					return prev.filter((data) => data !== user_id)
				}
				return [...prev, user_id]
			})
		}
		if (from === "deployment" && setDeleteModalList && modal_id) {
			setDeleteModalList((prev) => {
				if (prev.includes(modal_id)) {
					return prev.filter((data) => data !== modal_id)
				}
				return [...prev, modal_id]
			})
		}

		if (from === "finetuning" && setDeleteFinetuningList && pipeline_id) {
			setDeleteFinetuningList((prev) => {
				if (prev.includes(pipeline_id)) {
					return prev.filter((data) => data !== pipeline_id)
				}
				return [...prev, pipeline_id]
			})
		}
		if (from === "quota" && setSelectedRowList) {
			const quotaData: Quota = {
				name: row[0] as string,
				quota: parseInt(row[1] as string, 10),
				current_usage_value: parseInt(row[2] as string, 10),
				current_usage_percentage: parseFloat(row[3] as string),
			}

			setSelectedRowList((prev) => {
				const existingIndex = prev.findIndex((item) => item.name === quotaData.name)

				if (existingIndex !== -1) {
					const updatedList = [...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)]
					return updatedList
				} else {
					const updatedList = [...prev, quotaData]
					return updatedList
				}
			})
		}
	}

	const checkVisibility = (type: string): boolean => {
		if (from === "admin") {
			if (localStorage.getItem("role") === "admin") {
				if (localStorage.getItem("email") === row[1]) {
					return false
				}
				return true
			} else {
				return false
			}
		} else if (from === "deployment") {
			if (type === "checkbox") return true
			else if (type === "startStopStatus") return true
			else if (type === "maxMinReplicas") return true
			else if (type === "handleEdit" && row[2] === "Running") return true
			else return false
		} else {
			return true
		}
	}

	return (
		<tr className="cursor-pointer relative" onClick={handleRowClick}>
			{checkbox && (
				<td style={{ borderBottom: borderBottom }}>
					<input
						type="checkbox"
						defaultChecked={false}
						onClick={(event) => {
							event.stopPropagation()
							handleCheckbox()
						}}
						style={{
							padding: "0",
							margin: "0",
							visibility: checkVisibility("checkbox") ? "visible" : "hidden",
						}}
					/>
				</td>
			)}

			{row.map((item, colIndex) => {
				return (
					<>
						{typeof item === "object" ? (
							<td
								onClick={(event) => {
									item.stopPropogation && event.stopPropagation()
									handleClick(item)
								}}
								key={colIndex}
								style={{
									padding: item.type === "handleDeploy" ? "0.56rem 0rem 0.56rem 2rem" : padding,
									borderBottom: borderBottom,
									visibility: checkVisibility(item.type) ? "visible" : "hidden",
								}}
								dangerouslySetInnerHTML={{ __html: item.value }}
							></td>
						) : (
							<>
								<td
									key={colIndex}
									style={{
										padding: padding,
										borderBottom: borderBottom,
										maxWidth: "220px",
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
									}}
									title={item}
								>
									{item}
								</td>
							</>
						)}
					</>
				)
			})}
			{displayDeleteButton && (
				<div
					onClick={(event) => {
						event.stopPropagation()
						setDisplayDeleteButton(false)
						setDeleteModal((prev) => ({ ...prev, show: true }))
						setDeleteModal((prev) => ({
							...prev,
							id: typeof row[1] === "string" ? row[1] : "",
						}))
					}}
					onMouseLeave={() => setDisplayDeleteButton(false)}
					className="absolute right-4 -top-6 p-2 cursor-pointer border border-red-500 rounded bg-black-800 z-100"
				>
					Delete
				</div>
			)}
		</tr>
	)
}
