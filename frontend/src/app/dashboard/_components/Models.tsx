"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

import { errorHandler } from "@/utils/errorHandler"

export interface ModelData {
	unique_models: {
		key: number
		doc_count: number
	}[]
}

interface ModelProps {
	selectedInterval: string
	fetchData: (selectedInterval: string) => Promise<ModelData | undefined>
}

const Models: React.FC<ModelProps> = ({ selectedInterval, fetchData }) => {
	const router = useRouter()

	const [modelsData, setModelsData] = useState<ModelData>({
		unique_models: [],
	})

	const modelData = modelsData?.unique_models

	useEffect(() => {
		fetchData(selectedInterval)
			.then((data) => {
				if (data) setModelsData(data)
			})
			.catch((error: unknown) => {
				errorHandler(error, router)
			})
	}, [selectedInterval, fetchData])

	return (
		<div className="analysis-container rounded bg-slate-900 w-[33%] min-h-96 my-6">
			{Array.isArray(modelData) && modelData.length > 0 ? (
				<div className="overview_card pl-8 pr-4 py-2 ">
					<div className="flex">
						<h2 className="font-medium mt-4 mb-4">Models</h2>
					</div>

					<table className="w-full mb-4">
						<thead>
							<tr>
								<th className="pb-4 text-lg text-left">Model Name</th>
								<th className=" pb-4 text-lg text-left">Requests</th>
							</tr>
						</thead>
						<tbody>
							{modelData &&
								modelData.map(
									(
										model: {
											key: number
											doc_count: number
										},
										index: number,
									) => (
										<React.Fragment key={index}>
											<tr>
												<td className="text-md text-left ">{model.key}</td>
												<td className="text-md text-left">{model.doc_count}</td>
											</tr>
											{index !== modelData.length - 1 && (
												<tr>
													<td colSpan={2} className="">
														<hr />
													</td>
												</tr>
											)}
										</React.Fragment>
									),
								)}
						</tbody>
					</table>
				</div>
			) : (
				<>
					<div className="overview_card px-2 py-2 w-full ">
						<div className="flex ">
							<h2 className="font-medium m-4">Models</h2>
						</div>

						<table className="w-full mb-4 ml-4 px-2">
							<thead>
								<tr>
									<th className="pb-4 text-lg text-left">Model Name</th>
									<th className=" pb-4 text-lg text-left">Requests</th>
								</tr>
							</thead>
						</table>
						<div className="font-small flex m-auto items-center justify-center">
							No data
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default Models
