"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Copy from "../../../../public/copy.svg"
import styles from "@/styles/Explore/Explore.module.css"

import API from "@/API/API"
import Background from "@/components/Background"
import Hashtag from "@/components/Hashtag"
import { errorHandler } from "@/utils/errorHandler"
import { socket } from "@/utils/socket"

import Docs from "./_components/Docs/Docs"
import Heading from "./_components/Heading"
import ExploreComponent from "./_components/Run"
import Subheading from "./_components/Subheading"
import Train from "./_components/Train"
import Image from "next/image"

interface modelData {
	name: string
	task_type: string
	description: string
	architectures: string
	total_runs: number
	model_id: string
	license: string
	image: string
	minReplicas: string
	maxReplicas: string
	gpu: string
}

export type Tabs = "run" | "docs"

export default function Explore({ params }: { params: { model_id: string } }) {
	const router = useRouter()

	const [isClient, setIsClient] = useState(false)
	const [modelData, setModelData] = useState<modelData>()
	const [currentTab, setCurrentTab] = useState<Tabs>("run")
	const [loading, setLoading] = useState(false)
	const [submitButtonVisibility, setSubmitButtonVisibility] =
		useState<DocumentVisibilityState>("visible")

	const getModelInformation = async () => {
		try {
			const response = await API.get(`/models/get_model_by_id/${params.model_id}`)
			setModelData(response.data.data)
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	useEffect(() => {
		setIsClient(true)
		getModelInformation()
	}, [])

	useEffect(() => {
		socket.connect()
	}, [])

	const copyText = (id: string) => {
		const element: any = document.getElementById(id)
		var tempInput = document.createElement("input")
		tempInput.value = element.innerText
		document.body.appendChild(tempInput)
		tempInput.select()
		document.execCommand("copy")
		document.body.removeChild(tempInput)
	}

	return (
		<main className="pt-24 px-24">
			<Background />
			<Hashtag />
			<div className="flex">
				<div className="flex-2">
					<h2
						onClick={() => window.history.back()}
						className="flex gap-2 items-center font-normal cursor-pointer"
					>
						<ChevronLeft /> Back
					</h2>
				</div>
				<div className="flex-1">
					<Heading deployment_name={modelData?.name} />
				</div>
			</div>
			<div className="w-[fit-content] m-auto flex gap-4 mt-4 items-center">
				<span className="text-2xl text-center">ID : </span>
				<span id="model_id" className="text-2xl text-center">{window.location.pathname.split("/").pop()}</span>
				<Image
					onClick={() => copyText("model_id")}
					src={Copy.src}
					width={"50"}
					height={"50"}
					alt="copy"
					className={`${styles.copyImageSize} cursor-pointer`}/>
			</div>
			<Subheading description={modelData?.description} />
			<Train currentTab={currentTab} setCurrentTab={setCurrentTab} />
			{currentTab === "run" && (
				<ExploreComponent
					modelData={modelData}
					params={params}
					loading={loading}
					setLoading={setLoading}
					submitButtonVisibility={submitButtonVisibility}
					setSubmitButtonVisibility={setSubmitButtonVisibility}
				/>
			)}
			{currentTab === "docs" && <Docs modelData={modelData} params={params} />}
		</main>
	)
}
