"use client"

import { AxiosResponse } from "axios"
import { Plus, RefreshCcw, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useRecoilState, useSetRecoilState } from "recoil"

import API from "@/API/API"
import Button from "@/components/Button/Button"
import CustomizableButton from "@/components/Button/CustomizableButton"
import DeleteModalPopup from "@/components/DeleteModalPopup"
import Loader from "@/components/Loader"
import Pagination from "@/components/Pagination"
import Searchbar from "@/components/Searchbar"
import Table from "@/components/Table"
import { Response, Rowtypes } from "@/types"
import { deleteConfirmationAtom, editInstanceAtom, editModalAtom } from "@/utils/atoms"
import { errorHandler } from "@/utils/errorHandler"

import EditModalForm from "./EditModalForm"
import ModalForm from "./ModalForm"

interface model {
	id: string
	name: string
	status: string
	model_id: string
	replicas: string
	gpu: string
	total_runs: string
	created_at: string
}

const ModelDashboard = () => {
	const router = useRouter()
	const [modal, setModal] = useState(false)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState("")
	const [totalPages, setTotalPages] = useState(-1)
	const [editModal] = useRecoilState(editModalAtom)
	const [editInstance] = useRecoilState(editInstanceAtom)
	const setDeleteModal = useSetRecoilState(deleteConfirmationAtom)
	const [deleteModalList, setDeleteModalList] = useState<string[]>([])
	const [displayDeleteModal, setDisplayDeleteModal] = useState<boolean>(false)
	const [editInstanceModal, setEditInstanceModal] = useState<boolean>(false)
	const [row, setRow] = useState<Rowtypes[]>([])
	const [loading, setLoading] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setSearch(value)
	}

	const increasePageNumber = () => {
		setPage((page) => page + 1)
	}

	const decreasePageNumber = () => {
		setPage((page) => page - 1)
	}

	const handleInstanceState = async (id: string, currentState: string) => {
		try {
			setLoading(true)
			const response: AxiosResponse<{ success: boolean; data?: model[] }> = await API.post(
				"/deployment/edit",
				{
					model_id: id,
					state: currentState === "Running" ? "stop" : "start",
				},
			)
			if (response.data.success && response.data.data) {
				const updatedRow = row.map((item) => {
					if (item.id === id) {
						return {
							...item,
							status: currentState === "Running" ? "Stopped" : "Running",
						}
					}
					return item
				})
				setRow(updatedRow)
				toast.success("Model state updated successfully")
			}
			setLoading(false)
		} catch (error) {
			toast.error("Unexpected Error at Server. Please try again!!")
			errorHandler(error, router)
		}
	}

	useEffect(() => {
		void getResponse()
	}, [page, search])

	const refreshComponents = async () => {
		try {
			await getResponse()
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	const getResponse = async (): Promise<void> => {
		try {
			setLoading(true)

			const requestPayload: any = {
				page: page,
			}

			if (search.trim() !== "") {
				requestPayload.search = search
			}
			const response: AxiosResponse<
				Response<{
					deployments: model[]
					total_page: number
				}>
			> = await API.post("/deployment", requestPayload)
			if (response.data.success && response.data.data) {
				setRow([])
				setTotalPages(response.data.data.total_page)
				response.data.data.deployments?.forEach((element: model) => {
					setRow((prev: Rowtypes[]): Rowtypes[] => {
						return [
							...prev,
							{
								link: `/model/${element?.id}`,
								checkbox: true,
								value: [
									element?.name,
									element?.model_id,
									element?.status,
									element?.gpu,
									{
										type: "maxMinReplicas",
										value: element?.replicas,
										stopPropogation: true,
									},

									element?.total_runs,
									element?.created_at.split("T")[0],
									{
										type: "handleEdit",
										value: `<div><svg style="cursor: pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(14,165,233)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> </div>`,
										stopPropogation: true,
									},
								],
								model_id: element?.id,
							},
						]
					})
				})
				setLoading(false)
			}
		} catch (error) {
			toast.error("Unexpected Error at Server. Please try again!!")
			errorHandler(error, router)
		}
	}

	// useEffect(() => {
	// 	void getResponse()
	// }, [page])

	const showHideModal = () => {
		if (deleteModalList.length > 0) {
			setDisplayDeleteModal((prev) => !prev)
		}
	}
	const showEditModal = () => {
		setEditInstanceModal((prev) => !prev)
	}

	const handleDeleteModal = async () => {
		try {
			setLoading(true)
			const response: AxiosResponse<Response<unknown>> = await API.post("/deployment/delete", {
				deployment_ids: deleteModalList,
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

	const columns = [
		{
			name: "",
		},
		{
			name: "Name",
		},
		{
			name: "Model",
		},
		{
			name: "Status",
		},
		{
			name: "GPU",
		},
		{
			name: "Container",
		},
		{
			name: "Runs",
		},
		{
			name: "Created At",
		},
		{
			name: "",
		},
	]

	return (
		<div className="flex flex-col">
			<div id="model-dash-header" className="flex items-center justify-between">
				<h1 className="p-0">Model Deployment</h1>

				<div className="flex space-x-3">
					<Searchbar handleChange={handleChange} placeholder="Search" />
					<div>
						<Button onClick={() => setModal(!modal)}>
							Deploy Model <Plus />
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
				<div className="flex justify-center">
					<Loader />
				</div>
			)}
			{!loading && row.length > 0 && (
				<div
					className="mt-4 rounded-t-3xl rounded-b-3xl overflow-auto"
					style={{ border: "1px solid white" }}
				>
					<div className={`overflow-auto border-white scrollbarHeight`}>
						<Table
							from={"deployment"}
							tableWidth={"100vw"}
							columns={columns}
							rows={row}
							setDeleteModalList={setDeleteModalList}
							setEditInstanceModal={setEditInstanceModal}
							//eslint-disable-line
						/>
					</div>
				</div>
			)}
			{!loading && row.length === 0 && (
				<div>
					<h1 className="text-center"> No Models Deployed</h1>
				</div>
			)}
			{modal && <ModalForm modalOpen={setModal} />}
			{editModal.show && <EditModalForm />}
			{displayDeleteModal && (
				<DeleteModalPopup
					title="Are you sure you want to delete the model?"
					showHideModal={showHideModal}
					callback={() => void handleDeleteModal()}
				/>
			)}
			{editInstanceModal && (
				<DeleteModalPopup
					heading="Edit State"
					title={`Are you sure you want to ${editInstance.state === "stop" ? "start" : "stop"} the instance?`}
					showHideModal={showEditModal}
					callback={() => void handleInstanceState(editInstance.id, editInstance.state)}
				/>
			)}

			{!loading && page >= 0 && totalPages > 0 && (
				<Pagination
					moveToNextPage={increasePageNumber}
					moveToPreviousPage={decreasePageNumber}
					current={page}
					total={totalPages}
				/>
			)}
		</div>
	)
}

export default ModelDashboard
