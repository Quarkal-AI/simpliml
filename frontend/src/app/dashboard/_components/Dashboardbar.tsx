"use client"

import { Calendar, RefreshCcw } from "lucide-react"

const Dashboardbar = () => {
	return (
		<div className="flex justify-between wi">
			<div className="flex">
				<h1>Dashboard</h1>
			</div>

			<div className="flex justify-between space-x-8">
				<div className="ml-2 flex flex-row justify-end">
					{/* refresh button */}
					<button
						className="flex justify-center items-center pl-3 pr-3 rounded-lg ml-2 p-2"
						style={{
							background: "linear-gradient(to right, #1440b5, #00aaf0)",
						}}
					>
						<RefreshCcw size={"1.25em"} />
					</button>

					<button
						className="flex justify-center items-center bg-navy-800 ml-2 rounded-lg p-2"
						style={{
							background: "linear-gradient(to right, #1440b5, #00aaf0)",
						}}
					>
						<Calendar size={"1.25em"} />
						<select className="ml-2 bg-transparent text-sm text-white opacity-90 m-0 p-0 text-center">
							<option value="">1 minute</option>
							<option value="">5 minutes</option>
							<option value="">15 minutes</option>
							<option value="">30 minutes</option>
							<option value="">1 hour</option>
							<option value="">24 hours</option>
						</select>
					</button>
				</div>
			</div>
		</div>
	)
}

export default Dashboardbar
