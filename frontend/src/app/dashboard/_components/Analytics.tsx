"use client"

import "chart.js/auto"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"

import { errorHandler } from "@/utils/errorHandler"

export interface AnalyticsData {
	total_tokens: {
		key_as_string: string
		prompt_tokens: { value: number }
		completion_tokens: { value: number }
	}[]
	diff_error: {
		key_as_string: string
		total_errors: { value: number }
	}[]
	request_graph: {
		key_as_string: string
		doc_count: number
	}[]
	cache_hits: {
		date: string
		true: { doc_count: number }
		false: { doc_count: number }
	}[]
	costs: {
		date: string
		cost: number
	}[]
}

interface AnalyticsProps {
	selectedInterval: string
	fetchData: (selectedInterval: string) => Promise<AnalyticsData | undefined>
}

const Analytics: React.FC<AnalyticsProps> = ({ selectedInterval, fetchData }) => {
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
		total_tokens: [],
		diff_error: [],
		request_graph: [],
		cache_hits: [],
		costs: [],
	})

	const router = useRouter()

	const tokens = analyticsData?.total_tokens
	const errors = analyticsData?.diff_error
	const request = analyticsData?.request_graph
	const cache = analyticsData?.cache_hits
	const cost = analyticsData?.costs

	const graphData = {
		graph1: {
			labels: tokens && tokens.map((data) => data.key_as_string),
			datasets: [
				{
					label: "Input Tokens",
					data: tokens && tokens.map((data) => data.prompt_tokens.value),
					backgroundColor: ["rgba(0,170,240,1)"],
				},
				{
					label: "Output Tokens",
					data: tokens && tokens.map((data) => data.completion_tokens.value),
					backgroundColor: ["rgba(0,120,260,1)"],
				},
			],
			xlegend: "Days",
			ylegend: "Tokens",
		},
		graph3: {
			labels: request && request.map((data) => data.key_as_string),
			datasets: [
				{
					label: "Requests",
					data: request && request.map((data) => data.doc_count),
					backgroundColor: ["rgba(0,170,240,1)"],
				},
			],
			xlegend: "Days",
			ylegend: "Requests",
		},
		graph4: {
			labels: errors && errors.map((data) => data.key_as_string),
			datasets: [
				{
					label: "Error",
					data: errors && errors.map((data) => data.total_errors.value),
					backgroundColor: ["rgba(0,170,240,1)"],
				},
			],
			xlegend: "Days",
			ylegend: "Errors",
		},
	}

	const [tabs, setTabs] = useState("Tokens")
	const [selectedGraph, setSelectedGraph] = useState<keyof typeof graphData>("graph1")

	const handleTabsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setTabs(e.currentTarget.value)
		if (e.currentTarget.value === "Tokens") {
			setSelectedGraph("graph1")
		} else if (e.currentTarget.value === "Requests") {
			setSelectedGraph("graph3")
		} else if (e.currentTarget.value === "Error") {
			setSelectedGraph("graph4")
		}
	}

	useEffect(() => {
		fetchData(selectedInterval)
			.then((data) => {
				if (data) setAnalyticsData(data)
			})
			.catch((error: unknown) => {
				// Handle the error if needed
				errorHandler(error, router)
			})
	}, [selectedInterval, fetchData, router])

	// Chart options

	return (
		<div className="analysis-container rounded bg-slate-900 w-full h-max ">
			<div className="flex justify-between">
				<div className="flex">
					<h2 className="p-8 font-medium">Analytics</h2>
				</div>
				<div className="flex justify-between space-x-8">
					<div className="flex">
						<div id="model-dash-header" className="flex items-center justify-self-end mx-10">
							<div id="model-dash-tabs" className="flex justify-between space-x-8">
								<button
									value="Tokens"
									onClick={handleTabsClick}
									className={
										tabs === "Tokens" ? "border-b pb-4 border-navy-500 text-lg" : "pb-4 text-lg"
									}
									style={{ color: "#b2b2b2" }}
								>
									Tokens
								</button>
								<button
									value="Requests"
									onClick={handleTabsClick}
									className={
										tabs === "Requests" ? "border-b pb-4 border-navy-500 text-lg" : "pb-4 text-lg"
									}
									style={{ color: "#b2b2b2" }}
								>
									Requests
								</button>
								<button
									value="Error"
									onClick={handleTabsClick}
									className={
										tabs === "Error" ? "border-b pb-4 border-navy-500 text-lg" : "pb-4 text-lg"
									}
									style={{ color: "#b2b2b2" }}
								>
									Error
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-4 p-10" style={{ width: "auto", height: "37.5rem" }}>
				<Bar
					data={graphData[selectedGraph]}
					options={{
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								display: true, // Set to false to hide labels
								labels: {
									color: "white",
								},
								align: "end",
								position: "bottom",
							},
							tooltip: {
								mode: "index",
								intersect: false,
							},
						},
						scales: {
							x: {
								title: {
									display: true,
									color: "white",
									text: graphData[selectedGraph].xlegend,
									font: {
										size: 20,
									},
								},
							},
							y: {
								title: {
									display: true,
									color: "white",
									text: graphData[selectedGraph].ylegend,
									font: {
										size: 20,
									},
								},
								grid: {
									tickBorderDash: [3],
									tickBorderDashOffset: 3,
									drawTicks: false,
									color: "rgba(255, 255, 255, 0.15)",
								},
							},
						},
					}}
				/>
			</div>
		</div>
	)
}

export default Analytics
