"use client"

import { AxiosResponse } from "axios"
import exportFromJSON from "export-from-json"
import { Calendar, ChevronDown, ChevronUp, FolderInput, RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import API from "@/API/API"
import Background from "@/components/Background"
import Button from "@/components/Button/Button"
import Loader from "@/components/Loader"
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown"
import Pagination from "@/components/Pagination"
import Sidebar from "@/components/Sidebar"
import { Data, SingleSelectionDropdown } from "@/components/SingleSelectionDropdown"
import { Response } from "@/types"
import { errorHandler } from "@/utils/errorHandler"

import { ExportData, Filters, IUniqueField, Logs } from "."
import { DetailedSideBar } from "./_components/DetailedSideBar"

const Page = () => {
	const router = useRouter()

	const [isClient, setIsClient] = useState<boolean>(false)
	const [visibility, setVisibility] = useState<boolean>(false)
	const [logs, setLogs] = useState<Logs[]>([])
	const [totalPages, setTotalPages] = useState<number>(0)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [clickedLogsTraceId, setClickedLogsTraceId] = useState<string>("")

	const [loading, setLoading] = useState(true)

	const [filters, setFilters] = useState<Filters>({
		interval: "15m",
		model: [],
		username: [],
		path: [],
	})

	const [selectedIntervalIndex, setSelectedIntervalIndex] = useState<number>(0)
	const [selectedExportOptionsIndex, setSelectedExportOptionsIndex] = useState<number>(0)

	const [filterDropdownVisibility, setFilterDropdownVisibility] = useState<boolean>(false)
	const [exportDropdownVisibility, setExportDropdownVisibility] = useState<boolean>(false)

	const [uniqueModels, setUniqueModels] = useState<string[]>([])
	const [uniqueUsers, setUniqueUsers] = useState<string[]>([])
	const [uniquePaths, setUniquePaths] = useState<string[]>([])

	// msd -> multiselect dropdown states for different table columns
	const [msdModels, setMsdModels] = useState<boolean>(false)
	const [msdUsers, setMsdUsers] = useState(false)
	const [msdPaths, setMsdPaths] = useState(false)

	const fetchUniqueFieldData = async (field: string) => {
		try {
			if (field === "models" || field === "paths" || field === "users") {
				const res: AxiosResponse<Response<IUniqueField[]>> = await API.post("/logs/filters", {
					field,
					interval: filters.interval,
				})

				if (res.data.success) {
					if (res.data.data) {
						const data = res.data.data.map((f: IUniqueField) => f.key)

						if (field === "models") setUniqueModels(data)
						else if (field === "users") setUniqueUsers(data)
						else setUniquePaths(data)
					}
				}
			}
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	const fetchLogs = async (pg: number) => {
		try {
			setLoading(true)
			const res: AxiosResponse<
				Response<{
					logs: Logs[]
					totalPages: string
				}>
			> = await API.post(`/logs`, { filters, pageNumber: pg })

			if (res.data.success) {
				if (res.data.data) {
					setLogs(res.data.data.logs)
					setTotalPages(parseInt(res.data.data.totalPages) + 1)
					setLoading(false)
					return
				}
			}
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	const exportLogs = async (options: Data[], choosenIndex: number) => {
		try {
			const res: AxiosResponse<Response<ExportData>> = await API.post("/logs/export", {
				interval: filters.interval,
				type: options[choosenIndex].value as "csv" | "json",
			})

			if (res.data.success) {
				const data = res.data.data
				if (data) {
					const fileName = "logs"
					const exportType = options[choosenIndex].value as "csv" | "json"
					exportFromJSON({ data, fileName, exportType })
				}
			}
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	useEffect(() => {
		setIsClient(true)
		void fetchLogs(currentPage)
	}, [currentPage])

	useEffect(() => {
		// if filters are changed then we will always fetch page number 1
		void fetchLogs(1)
		setCurrentPage(1)
	}, [filters])

	return (
		<div className="relative flex z-1">
			<Background />
			<Sidebar />
			<DetailedSideBar
				visibility={visibility}
				traceId={clickedLogsTraceId}
				setVisibility={setVisibility}
			/>
			<div className="w-full pt-[4vh] px-8 py-8">
				<div className={"flex justify-between items-center w-full"}>
					<div className={`w-1/2`}>
						<h1 className="p-0">Logs</h1>
					</div>

					<div className="w-full flex items-center justify-end">
						<div className="ml-2 flex flex-row justify-end">
							{/* refresh button */}
							<Button onClick={() => void fetchLogs(1)}>
								<RefreshCcw size={"1.25rem"} />
							</Button>

							<div
								className="flex justify-center items-center ml-2 rounded-full px-6 py-3 relative"
								style={{
									background: "linear-gradient(to right, #1440b5, #00aaf0)",
								}}
							>
								<Calendar size={"1.25em"} />
								<SingleSelectionDropdown
									open={filterDropdownVisibility}
									data={[
										{ value: "15m", label: "15 minutes" },
										{ value: "60m", label: "60 minutes" },
										{ value: "24h", label: "24 hours" },
										{ value: "7d", label: "7 days" },
										{ value: "14d", label: "14 days" },
										{ value: "30d", label: "30 days" },
										{ value: "90d", label: "90 days" },
									]}
									selectedIndex={selectedIntervalIndex}
									setSelectedIndex={setSelectedIntervalIndex}
									onChange={(data, index) => {
										setFilters({
											...filters,
											interval: data[index].value as
												| "15m"
												| "60m"
												| "24h"
												| "7d"
												| "14d"
												| "30d"
												| "90d",
										})
									}}
									setOpen={setFilterDropdownVisibility}
								/>
								<button>
									{filterDropdownVisibility === false ? (
										<ChevronDown size={20} onClick={() => setFilterDropdownVisibility(true)} />
									) : (
										<ChevronUp size={20} onClick={() => setFilterDropdownVisibility(false)} />
									)}
								</button>
							</div>

							{/* export button */}
							<div
								className="flex flex-row justify-center items-center ml-2 rounded-full px-6 py-3 relative"
								style={{
									background: "linear-gradient(to right, #1440b5, #00aaf0)",
								}}
							>
								<FolderInput size={"1.25em"} />
								<p className="text-sm ml-2 cursor-pointer">Export</p>
								<SingleSelectionDropdown
									open={exportDropdownVisibility}
									data={[
										{ value: "csv", label: "CSV" },
										{ value: "json", label: "JSON" },
									]}
									selectedIndex={selectedExportOptionsIndex}
									setSelectedIndex={setSelectedExportOptionsIndex}
									setOpen={setExportDropdownVisibility}
									showLabel={false}
									triggerFunction={exportLogs}
								/>
								<button>
									{exportDropdownVisibility === false ? (
										<ChevronDown size={20} onClick={() => setExportDropdownVisibility(true)} />
									) : (
										<ChevronUp size={20} onClick={() => setExportDropdownVisibility(false)} />
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
				<hr />

				{loading ? (
					<div className="relative">
						<Loader />
					</div>
				) : (
					<>
						{logs.length > 0 && (
							<div
								style={{ border: "1px solid white" }}
								className={`rounded-t-3xl border-white mt-8 overflow-auto rounded-b-3xl`}
							>
								<table className="w-full  text-left">
									<thead className="">
										<tr
											className="text-sm"
											style={{
												background: "linear-gradient(to right, #1440b5, #00aaf0)",
												textTransform: "uppercase",
												borderBottom: "1px solid white",
											}}
										>
											<th style={{ padding: "0.75rem 0rem 0.75rem 2rem" }}>Timestamp</th>
											<th>
												<div className="flex items-center">
													Model
													<button
														onClick={() => {
															if (msdModels === false) {
																void fetchUniqueFieldData("models")
																setMsdModels(true)
															} else {
																setUniqueModels([])
																setMsdModels(false)
															}
														}}
													>
														{msdModels === true ? <ChevronUp /> : <ChevronDown />}
													</button>
													<MultiSelectDropdown
														data={uniqueModels}
														open={msdModels}
														filters={filters}
														setFilters={setFilters}
														field="model"
													/>
												</div>
											</th>
											<th>
												<div className="flex items-center">
													Path
													<button
														onClick={() => {
															if (msdPaths === false) {
																void fetchUniqueFieldData("paths")
																setMsdPaths(true)
															} else {
																setUniquePaths([])
																setMsdPaths(false)
															}
														}}
													>
														{msdPaths === true ? <ChevronUp /> : <ChevronDown />}
													</button>
													<MultiSelectDropdown
														data={uniquePaths}
														open={msdPaths}
														filters={filters}
														setFilters={setFilters}
														field="path"
													/>
												</div>
											</th>
											<th>Server</th>
											<th>
												<div className="flex items-center">
													Username
													<button
														onClick={() => {
															if (msdUsers === false) {
																void fetchUniqueFieldData("users")
																setMsdUsers(true)
															} else {
																setUniqueUsers([])
																setMsdUsers(false)
															}
														}}
													>
														{msdUsers === true ? <ChevronUp /> : <ChevronDown />}
													</button>
													<MultiSelectDropdown
														data={uniqueUsers}
														open={msdUsers}
														filters={filters}
														setFilters={setFilters}
														field="username"
													/>
												</div>
											</th>
											<th>Tokens</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{logs.length > 0 &&
											logs.map((row, i) => {
												let classname = "text-sm border-b border-gray-700"
												if (i == logs.length - 1) {
													classname = "text-sm p-4"
												}
												return (
													<>
														<tr
															key={i}
															className={`${classname} cursor-pointer`}
															onClick={() => {
																if (row.fields.meta.trace_id) {
																	setClickedLogsTraceId(row.fields.meta.trace_id)
																	setVisibility(!visibility)
																}
															}}
														>
															<td className="" style={{ padding: "0.75rem 0rem 0.75rem 2rem" }}>
																{row["@timestamp"]}
															</td>
															<td className="">{row.fields.meta.req?.model}</td>
															<td className="">{row.fields.meta.req?.url}</td>
															<td className="">{row.fields.meta.req?.server}</td>
															<td className="">{row.fields.meta.req?.headers?.metadata?._user}</td>
															<td className="">{row.fields.meta?.total_tokens}</td>
															<td className="">{row.fields?.meta?.res?.statusCode}</td>
														</tr>
													</>
												)
											})}
									</tbody>
								</table>
							</div>
						)}
						{logs.length == 0 && <h1 className="pt-8 text-center ">No logs</h1>}
						{logs.length > 0 && (
							<Pagination
								moveToPreviousPage={() => setCurrentPage(currentPage - 1)}
								moveToNextPage={() => setCurrentPage(currentPage + 1)}
								current={currentPage}
								total={totalPages}
							/>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default Page
