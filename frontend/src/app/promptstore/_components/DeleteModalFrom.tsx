"use client"

import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useRecoilState } from "recoil"

import API from "@/API/API"
import { checkedPromptsAtom, deleteConfirmationAtom } from "@/utils/atoms"
import { errorHandler } from "@/utils/errorHandler"

interface DeleteModalAtomType {
	id: string
	show: boolean
	delete: boolean
}

const DeleteModalFrom = () => {
	const router = useRouter()

	const [deleteModal, setDeleteModal] = useRecoilState<DeleteModalAtomType>(deleteConfirmationAtom)

	const [selectedPrompts, _] = useRecoilState(checkedPromptsAtom)

	const handleDelete = async () => {
		try {
			const response = await API.post("/prompt/delete", {
				prompt_ids: selectedPrompts,
			})

			if (response.status === 200) toast.success("Prompt deleted successfully")
			location.reload()
		} catch (error: unknown) {
			errorHandler(error, router)
		} finally {
			setDeleteModal((prev) => ({ ...prev, show: false }))
		}
	}

	return (
		<div className="">
			<div className="z-[99] fixed h-content left-1/2 -translate-x-1/2 w-1/4 top-1/2 -translate-y-1/2 flex flex-col rounded-xl border border-white bg-black-900 overflow-clip">
				<div className="relative p-4 flex items-center justify-center text-center back-gradient">
					<h3>Delete Prompt</h3>
					<X
						className="absolute right-4 cursor-pointer"
						onClick={() => setDeleteModal((prev) => ({ ...prev, show: false }))}
					/>
				</div>
				<div className="py-4 px-8 flex flex-col items-center gap-8 text-center">
					<h2>Are you sure you want to delete this prompt?</h2>
					<div className="w-full flex justify-between">
						<button
							className="button-bordered"
							onClick={(e) => setDeleteModal((prev) => ({ ...prev, show: false }))}
						>
							Cancel
						</button>
						<button className="button-t1" onClick={handleDelete}>
							Confirm
						</button>
					</div>
				</div>
			</div>
			<div
				className="absolute top-0 left-0 w-full h-full bg-black-900 opacity-40 z-0"
				onClick={() => setDeleteModal((prev) => ({ ...prev, show: false }))}
			></div>
		</div>
	)
}

export default DeleteModalFrom
