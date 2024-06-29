"use client"

import "chart.js/auto"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { errorHandler } from "@/utils/errorHandler"

export interface QuantitativeData {
	cache_hit: number
	average_latency: string
	requests: number
	input_tokens: number
	output_tokens: number
}

interface QuantitativeAnalysisProps {
	selectedInterval: string
	fetchData: (selectedInterval: string) => Promise<QuantitativeData | undefined>
}

const QuantitativeAnalysis: React.FC<QuantitativeAnalysisProps> = ({
	selectedInterval,
	fetchData,
}) => {
	const router = useRouter()

	const [quantitativeData, setQuantitativeData] = useState<QuantitativeData>({
		input_tokens: 0,
		output_tokens: 0,
		average_latency: "",
		requests: 0,
		cache_hit: 0,
	})


	const apiValue = quantitativeData?.average_latency

	const roundedValue = apiValue !== null ? parseFloat(apiValue).toFixed(2) : null

	useEffect(() => {
		fetchData(selectedInterval)
			.then((data) => {
				if (data) setQuantitativeData(data)
			})
			.catch((error: unknown) => {
				errorHandler(error, router)
			})
	}, [selectedInterval, fetchData])

	return (
		<div className="flex justify-between">
			<div className="analysis-container rounded bg-slate-900 w-full h-max mt-2 mb-6">
				<div className="main_overview flex p-8">
					<div className="overview_card px-8 py-2 w-1/4">
						<div className="overview_card-info text-slate-500 text-xl flex flex-row justify-between">
							<div className="flex">
								<h4 className="space-x-8"> Input Token</h4>
							</div>
						</div>
						<div className="overview_card-icon text-4xl">{quantitativeData?.input_tokens}</div>
					</div>
					<div className="overview_card px-8 py-2 w-1/4">
						<div className="overview_card-info text-slate-500 text-xl flex flex-row justify-between">
							<div className="flex">
								<h4 className="space-x-8"> Output Token</h4>
							</div>
						</div>
						<div className="overview_card-icon text-4xl">{quantitativeData?.output_tokens}</div>
					</div>
					<div className="overview_card px-8 py-2 w-1/4">
						<div className="overview_card-info text-slate-500 text-xl flex flex-row justify-between">
							<div className="flex">
								<h4 className="space-x-8"> Total Request</h4>
							</div>
						</div>
						<div className="overview_card-icon text-4xl">{quantitativeData?.requests}</div>
					</div>
					<div className="overview_card px-8 py-2 w-1/4">
						<div className="overview_card-info text-slate-500 text-xl flex flex-row justify-between">
							<div className="flex">
								<h4 className="space-x-8"> Average Latency</h4>
							</div>
						</div>
						<div className="overview_card-icon text-4xl">{roundedValue}ms</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default QuantitativeAnalysis
