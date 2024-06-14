"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import API from "@/API/API"
import Background from "@/components/Background"
import { ModelType } from "@/components/Model"
import Sidebar from "@/components/Sidebar"
import { errorHandler } from "@/utils/errorHandler"

import Chats from "../_components/Chats"
import ModalSettings from "../_components/ModelSettings"
import Prompts from "../_components/Prompts"
import Store from "../_components/Store"

const Page = () => {
	const router = useRouter()
	const [modelData, setModelData] = useState<ModelType[]>([])
	useEffect(() => {
		const getModelData = async () => {
			try {
				const response = await API.post("/deployment", {
					page: 1
				})
				setModelData(response.data?.data.deployments)
			} catch (error: unknown) {
				errorHandler(error, router)
			}
		}
		getModelData()
	}, [])
	return (
		<div className="relative flex h-[screen]">
			<Sidebar />
			<div className="w-full h-full pt-[4vh] px-8 ">
				<Store usage="create" />
				<hr />
				<div className="grid grid-cols-5 h-[75vh]">
					<Prompts />
					<Chats />
					<ModalSettings />
				</div>
			</div>
			<Background />
		</div>
	)
}

export default Page
