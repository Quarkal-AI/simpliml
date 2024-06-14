"use client"

import { Plus, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"

import API from "@/API/API"
import Background from "@/components/Background"
import Button from "@/components/Button/Button"
import CustomizableButton from "@/components/Button/CustomizableButton"
import Loader from "@/components/Loader"
import Pagination from "@/components/Pagination"
import Searchbar from "@/components/Searchbar"
import Sidebar from "@/components/Sidebar"
import {
	checkedPromptsAtom,
	deleteConfirmationAtom,
	promptVariable,
	systemPromptAtom,
	userPromptsAtom,
} from "@/utils/atoms"
import { errorHandler } from "@/utils/errorHandler"

import DeleteModalFrom from "./_components/DeleteModalFrom"
import PromptCard, { PromptType } from "./_components/PromptCard"

const Page = () => {
	const router = useRouter()

	const [selectedPrompts, _] = useRecoilState(checkedPromptsAtom)
	const [deleteModal, setDeleteModal] = useRecoilState(deleteConfirmationAtom)
	const [promptVariables, setPromptVariables] = useRecoilState(promptVariable)

	const setSystem = useSetRecoilState(systemPromptAtom)
	const setUserPrompts = useSetRecoilState(userPromptsAtom)
	const [page, setPage] = useState(1)
	const [prompts, setPrompts] = useState([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPage, setTotalPage] = useState(-1)

	const getAllPrompts = async () => {
		try {
			setLoading(true)
			const requestPayload: any = {
				page: currentPage,
			}
			if (search.trim() !== "") {
				requestPayload.search = search
			}
			const response = await API.post("/prompt/", requestPayload)
			setPrompts(response.data.data)
			setTotalPage(response.data.totalPage)
			setLoading(false)
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	useEffect(() => {
		getAllPrompts()
	}, [currentPage])

	const handleDelete = async () => {
		if (selectedPrompts.length > 0) {
			setDeleteModal({ ...deleteModal, show: true, delete: false })
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	useEffect(() => {
		getAllPrompts()
	}, [page, search])

	return (
		<div className="relative flex">
			<Sidebar />
			<div className="w-full pt-[4vh] px-8">
				<div>
					<div className="flex justify-between items-center">
						<h1 className="p-0">Prompt Store</h1>
						<div id="model-dash-header" className="flex justify-between items-center space-x-3">
							<Searchbar handleChange={handleChange} placeholder="Search Prompt" />
							<div className="flex gap-2">
								<Button
									className="px-10"
									onClick={() => {
										setSystem("")
										setUserPrompts([
											{
												id: Math.floor(Math.random() * 200),
												role: "user",
												content: "",
											},
										])
										setPromptVariables([])
										router.push("/promptstore/create")
									}}
								>
									Create <Plus />
								</Button>
								<CustomizableButton className="button-bordered" onClick={handleDelete}>
									Delete <Trash />
								</CustomizableButton>
							</div>
						</div>
					</div>
				</div>
				<hr />

				<div className="my-10 flex flex-col gap-2 relative">
					{loading ? (
						<Loader />
					) : (
						prompts.map((prompt: PromptType, index) => {
							return <PromptCard data={prompt} key={index} />
						})
					)}
					{!loading && prompts.length === 0 && <h1 className="text-center">No Prompts Created</h1>}
					{!loading && prompts.length > 0 && (
						<Pagination
							moveToNextPage={() => {
								if (currentPage < totalPage) setCurrentPage(currentPage + 1)
							}}
							moveToPreviousPage={() => {
								if (currentPage > 1) setCurrentPage(currentPage - 1)
							}}
							current={currentPage}
							total={totalPage}
						/>
					)}
				</div>
			</div>
			<Background />
			{deleteModal.show && <DeleteModalFrom />}
		</div>
	)
}

export default Page
