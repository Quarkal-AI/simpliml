"use client"

import { AxiosResponse } from "axios"
import { Plus, RefreshCcw, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

import API from "@/API/API"
import Background from "@/components/Background"
import Button from "@/components/Button/Button"
import CustomizableButton from "@/components/Button/CustomizableButton"
import DeleteModalPopup from "@/components/DeleteModalPopup"
import Loader from "@/components/Loader"
import Pagination from "@/components/Pagination"
import Searchbar from "@/components/Searchbar"
import Sidebar from "@/components/Sidebar"
import Table from "@/components/Table"
import { Response, Rowtypes } from "@/types"
import { deleteConfirmationAtom, fineTuningFormAtom, sidebarAtom } from "@/utils/atoms"
import { errorHandler } from "@/utils/errorHandler"

import DeployForm from "./_components/DeployForm"
import ModalForm from "./_components/ModalForm"
import Popup from "./_components/Popup"

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

interface pipelineList {
	// _id: string
	pipeline_name: string
	num_epochs: number
	max_sequence_length: number
	lr: number
	early_stop: number
	validation_percent: number
	batch_size: number
	lora_alpha: number
	lora_r: number
	lora_dropout: number
	model: string
	finetuning_method: string
	gpu: string
	wandb_project: string
	wandb_entity: string
	wandb_watch: string
	wandb_name: string
	wandb_log_model: string
	deploy: boolean
	status: string
	cpu: string
	memory: string
	created_at: string
	completed_in: string
	id: string
}

export default function Page() {
	const router = useRouter()
	const [mounting, setMounting] = useState(true)
	const [search, setSearch] = useState("")
	const [popupDisplay, setPopupDisplay] = useState("none")
	const [modalOpen, setModalOpen] = useState(false)
	const [modalDeployForm, setModalDeployForm] = useState(false)
	const [pipelineList, setPipelineList] = useState<pipelineList[]>([])
	const [loading, setLoading] = useState(true)
	const [pipelineId, setPipelineId] = useState("")
	const setDeleteModal = useSetRecoilState(deleteConfirmationAtom)
	const [deleteFinetuningList, setDeleteFinetuningList] = useState<string[]>([])
	const [displayDeleteModal, setDisplayDeleteModal] = useState<boolean>(false)
	const isSidebarOpen = useRecoilValue(sidebarAtom)
	const [row, setRow] = useState<Rowtypes[]>([])
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(-1)
	const setFinetuningModelFormData = useSetRecoilState<finetuningModalFormData>(fineTuningFormAtom)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setSearch(value)
	}

	const refreshComponents = async () => {
		try {
			await getPipelines()
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}
	const showHideModal = () => {
		if (deleteFinetuningList.length > 0) {
			setDisplayDeleteModal((prev) => !prev)
		}
	}

	const handleDeleteModal = async () => {
		try {
			setLoading(true)
			const response: AxiosResponse<Response<unknown>> = await API.post("/finetuning/delete", {
				pipeline_ids: deleteFinetuningList,
			})

			if (response && typeof window !== "undefined") {
				window.location.reload()
			}

			setLoading(false)
			setDeleteModal((prev) => ({ ...prev, show: false }))
			window.location.reload()
		} catch (error) {
			toast.error("Unexpected Error at Server. Please try again!!")
			errorHandler(error, router)
		}
	}

	const getPipelines = async () => {
		try {
			type pipelineResponse = {
				pipeline: pipelineList[]
				total_page: number
			}
			const requestPayload: any = {
				page: page,
			}

			if (search.trim() !== "") {
				requestPayload.search = search
			}
			const response: AxiosResponse<Response<pipelineResponse>> = await API.post("/finetuning/", requestPayload)

			if (response.data.success && response.data.data) {
				const data: pipelineList[] = response.data.data.pipeline
				setPipelineList(data)
				setTotalPages(response.data.data.total_page)
			}
			setLoading(false)
		} catch (error: unknown) {
			errorHandler(error, router)
			setLoading(false)
		}
	}

	const increasePageNumber = () => {
		setPage((page) => page + 1)
	}

	const decreasePageNumber = () => {
		setPage((page) => page - 1)
	}

	useEffect(() => {
		// if (mounting) {
		// 	setMounting(false)
		// 	return
		// }
		void getPipelines()
	}, [page, search])

	const columns = [
		{
			name: "",
		},
		{
			name: "Name",
		},
		{
			name: "Id",
		},
		{
			name: "Status",
		},
		{
			name: "Model",
		},
		{
			name: "GPU",
		},
		{
			name: "Training Time",
		},
		{
			name: "Created",
		},
	]

	const completedButton = `<span class="px-2 py-1 text-green-500 border-green-500 border rounded-full">status</span>`
	const failedButton = `<span class="px-2 py-1 text-red-500 border-red-500 border rounded-full">status</span>`
	const activeButton = `<span class="px-2 py-1 text-blue-500 border-blue-500 border rounded-full">status</span>`
	const startButton = `<span class="px-2 py-1 text-white-500 border-white-500 border rounded-full">status</span>`

	const setTheRow = () => {
		setRow([])
		pipelineList.forEach((pipeline: pipelineList) => {
			setRow((prev: Rowtypes[]): Rowtypes[] => {
				return [
					...prev,
					{
						checkbox: true,
						value: [
							pipeline.pipeline_name,
							pipeline.id,
							{
								type: "handlePipelineDetailsPopup",
								value:
									pipeline.status === "Starting"
										? startButton.replaceAll("status", "Starting")
										: pipeline.status === "Complete"
											? completedButton.replaceAll("status", "Complete")
											: pipeline.status === "Failed"
												? failedButton.replaceAll("status", "Failed")
												: activeButton.replaceAll("status", "Active"),
								stopPropogation: false,
							},
							pipeline.model,
							pipeline.gpu,
							pipeline.completed_in,
						],
						pipeline_id: pipeline?.id,
					},
				]
			})
		})
	}

	useEffect(() => {
		setTheRow()
	}, [pipelineList])

	return (
		<div className="relative">
			<div className="flex">
				<Sidebar />
				<div className={`pt-[4vh] ${isSidebarOpen ? " w-[86vw]" : " w-[94vw] "} px-8`}>
					<div className="flex justify-between items-center">
						<div className="flex p-0">
							<h1 className="p-0 m-0">Model Fine Tuning</h1>
						</div>

						{/* search and create pipeline */}
						<div className="flex justify-between space-x-3">
							<div>
								<Searchbar handleChange={handleChange} placeholder="Search Pipelines" />
							</div>
							<div>
								<Button
									onClick={() => {
										setModalOpen(true)
									}}
								>
									<span>Create Pipeline</span> <Plus />
								</Button>
							</div>
							<div>
								<CustomizableButton className="button-bordered" onClick={showHideModal}>
									<Trash style={{ padding: "0.1rem" }} />
								</CustomizableButton>
							</div>
							<div>
								<Button onClick={() => void refreshComponents()}>
									<RefreshCcw style={{ padding: "0.1rem" }} />
								</Button>
							</div>
						</div>
					</div>
					<hr />
					{loading && (
						<div className="relative">
							<Loader />
						</div>
					)}
					{!loading && pipelineList.length !== 0 && (
						<div
							className="mt-8 rounded-t-3xl rounded-b-3xl overflow-auto"
							style={{ border: "1px solid white" }}
						>
							<div className={`overflow-auto border-white scrollbarHeight`}>
								<Table
									from={"finetuning"}
									tableWidth={"100vw"}
									columns={columns}
									rows={row}
									setPopupDisplay={setPopupDisplay}
									setPipelineId={setPipelineId}
									setModalDeployForm={setModalDeployForm}
									setFinetuningModelFormData={setFinetuningModelFormData}
									setDeleteFinetuningList={setDeleteFinetuningList}
								/>
							</div>
						</div>
					)}
					{!loading && pipelineList.length !== 0 && (
						<Pagination
							moveToPreviousPage={decreasePageNumber}
							moveToNextPage={increasePageNumber}
							current={page}
							total={totalPages}
						/>
					)}
					{pipelineList.length === 0 && !loading && (
						<div className="mt-8">
							<h1 className="text-center"> No finetuning Pipelines created</h1>
						</div>
					)}
				</div>
			</div>
			<div style={{ display: popupDisplay }}>
				<Popup
					pipelineId={pipelineId}
					setPopupDisplay={setPopupDisplay}
					popupDisplay={popupDisplay}
				/>
			</div>
			<div style={{ display: modalOpen ? "block" : "none" }}>
				<ModalForm modalOpen={setModalOpen} usage={"create"} />
			</div>
			<div style={{ display: modalDeployForm ? "block" : "none" }}>
				<DeployForm modalDeployForm={setModalDeployForm} usage={"deploy_pipeline"} />
			</div>
			{displayDeleteModal && (
				<DeleteModalPopup
					title="Are you sure you want to delete the modal ?"
					showHideModal={showHideModal}
					callback={() => void handleDeleteModal()}
				/>
			)}
			<Background />
		</div>
	)
}
