"use client"

import { AxiosResponse } from "axios"
import { Calendar, ChevronDown, ChevronUp, RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import API from "@/API/API"
import Background from "@/components/Background"
import Button from "@/components/Button/Button"
import Sidebar from "@/components/Sidebar"
import { SingleSelectionDropdown } from "@/components/SingleSelectionDropdown"
import { Response } from "@/types"
import { errorHandler } from "@/utils/errorHandler"

import Analytics, { AnalyticsData } from "./_components/Analytics"
import ErrorCount, { ErrorData } from "./_components/ErrorCount"
import Models, { ModelData } from "./_components/Models"
import QuantitativeAnalysis, {
	QuantitativeData,
} from "./_components/QuantitativeAnalysis"
import UserId, { UserData } from "./_components/UserId"

const intervalOptions = [
	{ value: "7d/d", label: "7 days" },
	{ value: "15d/d", label: "15 days" },
	{ value: "30d/d", label: "30 days" },
	{ value: "90d/d", label: "90 days" },
	{ value: "6M/M", label: "6 months" },
	{ value: "1y/y", label: "1 year" },
]

const Page = () => {
	const router = useRouter()

	const [selectedInterval, setSelectedInterval] = useState("15d")
	const [defaultIndex, setDefaultIndex] = useState<number>(1)
	const [filterDropdownVisibility, setFilterDropdownVisibility] =
		useState<boolean>(false)

	const handleIntervalChange = (
		data: { value: string; label: string }[],
		index: number,
	) => {
		const selectedValue = data[index].value
		setSelectedInterval(selectedValue)
	}

	const getQuantitativeData = async (
		selectedInterval: string,
	): Promise<QuantitativeData | undefined> => {
		try {
			const response: AxiosResponse<Response<QuantitativeData>> =
				await API.post("/dashboard/get_quantitative_data", {
					selectedInterval,
				})

			if (response.data.success) return response.data.data
			return undefined
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	const getAnalyticsData = async (
		selectedInterval: string,
	): Promise<AnalyticsData | undefined> => {
		try {
			const response: AxiosResponse<Response<AnalyticsData>> = await API.post(
				"/dashboard/get_analytics_data",
				{
					selectedInterval,
				},
			)

			if (response.data.success) return response.data.data
			return undefined
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	const getErrorData = async (
		selectedInterval: string,
	): Promise<ErrorData | undefined> => {
		try {
			const response: AxiosResponse<Response<ErrorData>> = await API.post(
				"/dashboard/get_piechart_data",
				{
					selectedInterval,
				},
			)

			if (response.data.success) return response.data.data
			return undefined
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}


	const getModelData = async (
		selectedInterval: string,
	): Promise<ModelData | undefined> => {
		try {
			const response: AxiosResponse<Response<ModelData>> = await API.post(
				"/dashboard/get_models_data",
				{
					selectedInterval,
				},
			)

			if (response.data.success) return response.data.data
			return undefined
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	const getUserIdData = async (
		selectedInterval: string,
	): Promise<UserData | undefined> => {
		try {
			const response: AxiosResponse<Response<UserData>> = await API.post(
				"/dashboard/get_users_data",
				{
					selectedInterval,
				},
			)

			if (response.data.success) return response.data.data
			return undefined
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	const refreshComponents = async () => {
		try {
			const initialInterval = "15d"

			setDefaultIndex(1)

			await getAnalyticsData(initialInterval)
			await getQuantitativeData(initialInterval)
			await getUserIdData(initialInterval)
			await getModelData(initialInterval)
			await getErrorData(initialInterval)
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	return (
		<div className="relative flex z-1">
			<Background />
			<Sidebar />

			<div className="w-full pt-[4vh] px-8 py-8 overflow-x-hidden">
				<div className={"flex justify-between items-center w-full"}>
					<div className={`w-1/2`}>
						<h1 className="p-0">Dashboard</h1>
					</div>

					{/* search functionality */}
					<div className="w-full flex items-center justify-end">
						<div className="ml-2 flex flex-row justify-end items-center">
							{/* refresh button */}
							<Button onClick={() => void refreshComponents()}>
								<RefreshCcw size={"1.25em"} />
							</Button>

							<Button className="flex justify-center items-center ml-2 relative">
								<Calendar size={"1.25em"} />
								<SingleSelectionDropdown
									open={filterDropdownVisibility}
									data={intervalOptions}
									selectedIndex={defaultIndex}
									setSelectedIndex={setDefaultIndex}
									onChange={handleIntervalChange}
									setOpen={setFilterDropdownVisibility}
								/>
								<button>
									{!filterDropdownVisibility ? (
										<ChevronDown
											size={20}
											onClick={() => setFilterDropdownVisibility(true)}
										/>
									) : (
										<ChevronUp
											size={20}
											onClick={() => setFilterDropdownVisibility(false)}
										/>
									)}
								</button>
							</Button>
						</div>
					</div>
				</div>
				<hr />
				<QuantitativeAnalysis
					selectedInterval={selectedInterval}
					fetchData={() => getQuantitativeData(selectedInterval)}
				/>
				<Analytics
					selectedInterval={selectedInterval}
					fetchData={() => getAnalyticsData(selectedInterval)}
				/>
				<div className="flex justify-between">
					<UserId
						selectedInterval={selectedInterval}
						fetchData={() => getUserIdData(selectedInterval)}
					/>
					<Models
						selectedInterval={selectedInterval}
						fetchData={() => getModelData(selectedInterval)}
					/>
					<ErrorCount
						selectedInterval={selectedInterval}
						fetchData={() => getErrorData(selectedInterval)}
					/>
				</div>
			</div>
		</div>
	)
}

export default Page
