"use client"

import "chart.js/auto"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"

import { errorHandler } from "@/utils/errorHandler"

export interface ErrorData {
	errors: {
		key: number
		doc_count: number
	}[]
	total_errors: number
}

interface ErrorProps {
	selectedInterval: string
	fetchData: (selectedInterval: string) => Promise<ErrorData | undefined>
}

const ErrorCount: React.FC<ErrorProps> = ({ selectedInterval, fetchData }) => {
	const router = useRouter()

	const [errorData, setErrorData] = useState<ErrorData>({
		errors: [],
		total_errors: 0,
	})

	const error = errorData?.errors

	const data = {
		labels: error && error.map((data) => data.key),
		datasets: [
			{
				label: "Count",
				data: error && error.map((data) => data.doc_count),
				backgroundColor: [
					"#1c3b77",
					"#3457D5",
					"#7baffe",
					"#0076CE",
					"rgba(20,64,181,1)",
				],
				borderColor: "#0f172a",
				hoverOffset: 4,
			},
		],
	}

	// Options for the chart
	const options = {
		maintainAspectRatio: false, // Disable default aspect ratio
		responsive: true,
		plugins: {
			legend: {
				display: false, // Set to false to hide labels
			},
		}, // Disable responsiveness
	}

	useEffect(() => {
		fetchData(selectedInterval)
			.then((data) => {
				if (data) setErrorData(data)
			})
			.catch((error: unknown) => {
				errorHandler(error, router)
			})
	}, [selectedInterval, fetchData])

	return (
		<div className="analysis-container rounded bg-slate-900 w-[33%] min-h-96 my-6">
			{Array.isArray(error) && error.length > 0 ? (
				<>
					<div className="overview_card px-2 py-2 w-full ">
						<div className="overview_card px-2 py-2 ">
							<div className="flex">
								<h2 className="font-medium m-4">Error count</h2>
							</div>
							<div className="overview_card-icon text-4xl  ml-4">
								{errorData?.total_errors}
							</div>
							<div className="h-4/5">
								<Doughnut data={data} options={options} />
							</div>
							<hr />
							<div className="flex flex-wrap">
								{error &&
									error.map(
										(
											errors: { key: number; doc_count: number },
											index: number,
										) => (
											<div className="w-1/2 p-2" key={index}>
												<div className="p-2 m-1">
													<span className="text-3xl">{errors.doc_count} </span>
													Error Code: {errors.key}
												</div>
											</div>
										),
									)}
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="overview_card px-2 py-2 w-full ">
						<div className="flex">
							<h2 className="font-medium m-4 ">Error count</h2>
						</div>
					</div>
					<div className="font-small flex m-auto items-center justify-center">
						No data
					</div>
				</>
			)}
		</div>
	)
}

export default ErrorCount
