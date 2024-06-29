"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

import { errorHandler } from "@/utils/errorHandler"

export interface UserData {
	users: {
		key: number
		doc_count: number
		length: number
	}[]
}

interface UserIdProps {
	selectedInterval: string
	fetchData: (selectedInterval: string) => Promise<UserData | undefined>
}

const UserId: React.FC<UserIdProps> = ({ selectedInterval, fetchData }) => {
	const router = useRouter()

	const [userData, setUserData] = useState<UserData>({
		users: [],
	})

	const user = userData?.users

	useEffect(() => {
		fetchData(selectedInterval)
			.then((data) => {
				if (data) setUserData(data)
			})
			.catch((error: unknown) => {
				errorHandler(error, router)
			})
	}, [selectedInterval, fetchData])

	return (
		<div className="analysis-container rounded bg-slate-900 w-[33%] min-h-96 my-6">
			{Array.isArray(user) && user.length > 0 ? (
				<div className="overview_card pl-8 pr-8 py-8">
					<table className="w-full mb-4 py-4">
						<thead>
							<tr>
								<th className="pb-4 text-lg text-left w-3/5">User ID</th>
								<th className=" pb-4 text-lg text-left w-1/5">Requests</th>
							</tr>
						</thead>
						<tbody>
							{user &&
								user.map(
									(
										user: {
											key: number
											doc_count: number
											length: number
										},
										index: number,
									) => (
										<React.Fragment key={index}>
											<tr>
												<td className=" pb-2 text-md text-left ">{user.key}</td>
												<td className=" pb-2 text-md text-left">
													{user.doc_count}
												</td>
											</tr>
											{index !== user.length - 1 && (
												<tr>
													<td colSpan={3} className="">
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
					<div className="overview_card pl-8 pr-8 py-8 ">
						<table className="w-full mb-4 py-4">
							<thead>
								<tr>
									<th className="pb-4 text-lg text-left w-3/5">User-ID</th>
									<th className=" pb-4 text-lg text-left w-1/5">Requests</th>
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

export default UserId
