"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"

import API from "@/API/API"
import Background from "@/components/Background"
import { ModelType } from "@/components/Model"
import Sidebar from "@/components/Sidebar"
import {
	editPromptAtom,
	systemPromptAtom,
	userPromptsAtom,
} from "@/utils/atoms"

import Chats from "../../_components/Chats"
import ModelSettings from "../../_components/ModelSettings"
import { PromptType } from "../../_components/PromptCard"
import Prompts from "../../_components/Prompts"
import Store from "../../_components/Store"

const Page = () => {
	const id = useParams()

	const router = useRouter()
	const setSystem = useSetRecoilState(systemPromptAtom)
	const promptData = useRecoilValue<PromptType>(editPromptAtom)
	const setUserPrompts = useSetRecoilState(userPromptsAtom)
	const [modelData, setModelData] = useState<ModelType[]>([])

	const getModelData = async () => {
		const response = await API.post("/deployment", {
			page: 1
		})
		setModelData(response.data?.data.deployments)
	}

	useEffect(() => {
		setSystem("")
		if (promptData?.prompt?.length >= 1 && promptData?.prompt[0]?.role === "system") {
			setSystem(promptData?.prompt[0]?.content)
			setUserPrompts(promptData?.prompt?.slice(1))
		} else {
			setUserPrompts(promptData.prompt)
		}
		getModelData()
	}, [])

	return (
		<div className="relative flex h-[screen]">
			<div className="sticky top-0">
				<Sidebar />
			</div>
			<div className="w-full h-full pt-[4vh] px-8">
				<Store title={promptData.name} usage="edit" />
				<hr />
				<div className="grid grid-cols-5 h-[86vh]">
					<Prompts />
					<Chats />
					<ModelSettings />
				</div>
			</div>
			<Background />
		</div>
	)
}

export default Page
