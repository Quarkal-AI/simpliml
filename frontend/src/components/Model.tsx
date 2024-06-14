import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import API from "@/API/API"
import styles from "@/styles/Model.module.css"
import { errorHandler } from "@/utils/errorHandler"

import total_runs from "../../public/total_runs.svg"

export interface ModelType {
	id: string
	model_id: string
	maxReplicas: number
	minReplicas: number
	name: string
	description: string
	created_at: string
	status: string
	gpu: string
	total_runs: number
}

interface MyComponentProps {
	id: number
}

export default function ModelType({ id }: MyComponentProps) {
	const router = useRouter()

	const [data, setData] = useState([])

	const getAllModels = async (id: number) => {
		try {
			const response = await API.post("/deployment", {
				page: id,
			})
			setData(response.data.data)
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	useEffect(() => {
		getAllModels(id)
	}, [id])

	return (
		<>
			<div className="flex gap-3 flex-wrap justify-between">
				{data?.map((data: ModelType, index: number) => {
					return (
						<div
							key={index}
							className={`border border-white rounded-lg p-4 flex flex-col w-[32%] ${styles.modelStyleContainer}`}
						>
							<Link href={`/model/${data.id}`}>
								<h1
									className={`text-lg font-bold leading-24 tracking-0 text-left ${styles.modelNameMarginTop}`}
								>
									{data.model_id}
								</h1>
								<p className=" text-base font-normal leading-tight tracking-0 text-gray-500">
									{data.description.slice(0, 90) + "..."}
								</p>
								<div className="flex justify-between items-center mt-2">
									<div className={`p-2 rounded-full ${styles.modelStatusBackground}`}>
										<span>{data.status}</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className={`${styles.rotateRocketTowardsRight}`}>
											<Image
												width={"100"}
												height={"100"}
												src={total_runs.src}
												alt="total_runs"
												className={`w-full`}
											/>
										</div>
										<div>
											<p className={`${styles.modelTotalRunsColor}`}>{data.total_runs} runs</p>
										</div>
									</div>
								</div>
							</Link>
						</div>
					)
				})}
			</div>
		</>
	)
}
