"use client"

import { useRecoilValue } from "recoil"

import Background from "@/components/Background"
import Sidebar from "@/components/Sidebar"
import { sidebarAtom } from "@/utils/atoms"

import ModelDashboard from "./_components/ModelDashboard"

const Page = () => {
	const isSidebarOpen = useRecoilValue(sidebarAtom)

	return (
		<div className="relative">
			<div className="flex">
				<Sidebar />
				<div className={`pt-[4vh] ${isSidebarOpen ? " w-[86vw]" : " w-[94vw] "} px-8`}>
					<ModelDashboard />
				</div>
			</div>
			<Background />
		</div>
	)
}

export default Page
