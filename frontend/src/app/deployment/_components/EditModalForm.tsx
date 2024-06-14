"use client"

import { AxiosResponse } from "axios"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useRecoilState } from "recoil"

import API from "@/API/API"
import Loader from "@/components/Loader"
import { Response } from "@/types"
import { deploymentFormAtom, editModalAtom } from "@/utils/atoms"
import { errorHandler } from "@/utils/errorHandler"

interface EditModalAtomType {
	id: string
	show: boolean
}
interface Modeldata {
	replicas: number
	gpu: string
}
interface ChangedData {
	containers?: number
	gpu?: string
	deployment_id: string
}

const EditModalForm = () => {
	const router = useRouter()
	const [editModal, setEditModal] = useRecoilState<EditModalAtomType>(editModalAtom)
	const [formData, setFormData] = useRecoilState(deploymentFormAtom)
	const [originalModelData, setOriginalModelData] = useState<Modeldata>()

	const [loading, setLoading] = useState(false)
	const [isDataChanged, setIsDataChanged] = useState<boolean>(false)

	const handleFormChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
			| React.ChangeEvent<HTMLSelectElement>,
	) => {
		if (
			e.target.name === "max_containers" ||
			e.target.name === "min_containers" ||
			e.target.name === "GPU" ||
			e.target.name === "idle_window"
		)
			setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) })
		else setFormData({ ...formData, [e.target.name]: e.target.value })
		setIsDataChanged(true)
	}

	const getInitialData = async () => {
		try {
			const response: AxiosResponse<Response<Modeldata>> = await API.get(
				`/models/get_model_by_id/${editModal.id}`,
			)
			if (response.data.success) {
				if (response.data.data) {
					const modelData = response.data.data

					// @ts-ignore
					setFormData({
						model_id: editModal.id,
						containers: modelData.replicas,
						deployment_name: "",
						description: "",
						model_type: "",
						gpu: modelData.gpu
					})
					setOriginalModelData(modelData)
				}
			} else {
				console.error("Failed to fetch initial data:", response.data.message)
			}
		} catch (error) {
			errorHandler(error, router)
		}
	}

	const handleDeploy = async () => {
		try {
			const changedData: ChangedData = { deployment_id: editModal.id }

			if (originalModelData) {
				if (formData.containers !== originalModelData?.replicas) {
					changedData.containers = formData.containers
				}
				if (formData.gpu !== originalModelData?.gpu) {
					changedData.gpu = formData.gpu
				}
			}
			
			if (Object.keys(changedData).length > 1) {
				setLoading(true)
				const response = await API.post("/deployment/edit", changedData)
				if (response.status === 200) {
					toast.success("Deployment edited successfully")
					window.location.reload()
				}
			}
		} catch (error: unknown) {
			errorHandler(error, router)
		} finally {
			setLoading(false)
			setEditModal((prev) => ({ ...prev, show: false }))
		}
	}
	useEffect(() => {
		void getInitialData()
	}, [])

	return (
		<div className="">
			<div className="z-[99] fixed min-h-[40vh] h-content left-1/2 -translate-x-1/2 w-1/2 top-1/2 -translate-y-1/2 flex flex-col rounded-xl border border-white bg-black-900 overflow-clip">
				<div className="relative p-4 flex items-center justify-center text-center back-gradient">
					<h3>Edit Deployment</h3>
					<X
						className="absolute right-4 cursor-pointer"
						onClick={() => setEditModal((prev) => ({ ...prev, show: false }))}
					/>
				</div>
				{loading ? (
					<Loader />
				) : (
					<div className="py-4 px-8 flex flex-col items-center gap-2">
						<div className="w-full flex justify-between gap-4">
							<div className="w-full">
								<label htmlFor="max_containers">Containers</label>
								<div className="select">
									<select
										name="containers"
										onChange={handleFormChange}
										value={formData.containers}
									>
										<option value={1}>1</option>
										<option value={2}>2</option>
										<option value={3}>3</option>
									</select>
								</div>
							</div>
						</div>
						<div className="w-full flex justify-between gap-4">
							<div className="w-full">
								<label htmlFor="GPU">GPU</label>
								<div className="select">
									<select name="gpu" onChange={handleFormChange} value={formData.gpu}>
									<option value="">Select GPU</option>
									<option value="l4">L4 24GB</option>
									<option value="a10">A10 24GB</option>
									<option value="a100">A100 40GB</option>
									<option value="a100_80">A100 80GB</option>
									</select>
								</div>
							</div>
						</div>

						<div className="w-full flex justify-between">
							<button
								className="button-bordered"
								onClick={() => setEditModal((prev) => ({ ...prev, show: false }))}
							>
								Cancel
							</button>

							<button
								className="button-t1"
								onClick={() => void handleDeploy()}
								disabled={isDataChanged === true ? false : true}
							>
								Confirm
							</button>
						</div>
					</div>
				)}
			</div>
			<div
				className="absolute top-0 left-0 w-full h-full bg-black-900 opacity-40 z-0"
				onClick={() => setEditModal((prev) => ({ ...prev, show: false }))}
			></div>
		</div>
	)
}

export default EditModalForm
