"use client"

import {
	ArrowLeft,
	ArrowRight,
	BookText,
	FileClock,
	Key,
	Rocket,
	Sliders,
	Warehouse,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"

import { settingTabAtom, sideBarStateAtom, sidebarAtom } from "@/utils/atoms"

import logoNamed from "./../../public/logo_named.svg"

const Sidebar = () => {
	const router = useRouter()
	const [inwindow, setInWindow] = useState<string>()
	const [sideTab, setSideTab] = useRecoilState(sideBarStateAtom)
	const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(sidebarAtom)
	const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false)

	const handleSideTabClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const targetId = (e.target as HTMLDivElement)?.id || (e.currentTarget as HTMLDivElement).id
		localStorage.setItem("activenavlink", `/${targetId}`)
		router.push(`/${targetId}`)
	}

	useEffect(() => {
		if (typeof window !== "undefined") {
			const currentPath = window.location.pathname
			localStorage.setItem("activenavlink", currentPath)
			setInWindow(currentPath)
			// Check if the current tab is the settings tab, and open the dropdown accordingly
			setIsSettingsDropdownOpen(currentPath.startsWith("/settings"))
		}
	}, [])

	useEffect(() => {
		if (typeof inwindow != "undefined") {
			setSideTab(inwindow)
		}
	}, [inwindow])

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen)
	}
	return (
		<>
			<div
				className={`fixed top-0   ease-in-out  ${isSidebarOpen ? " w-[14vw] p-4 " : "w-[5vw] p-4"}  h-screen pl-4 z-40 flex flex-col border-r border-white border-opacity-20 transition-width duration-300 ease-in-out`}
			>
				<div
					className="cursor-pointer  px-2 py-2 bg-navy-900"
					onClick={() => window.location.replace(`${window.location.origin}/deployment`)}
				>
					{isSidebarOpen ? (
						<>
							<Image src={logoNamed.src} alt="logo" width={1000} height={1000} />
						</>
					) : (
						<Image src="/logo.png" alt="logo" width={200} height={200} />
					)}
				</div>

				<div className="py-4 h-full text-gray-500 flex flex-col">
					<div
						className={`sidebar-item group  ${
							localStorage.getItem("activenavlink") === "/deployment" ? "sidebar-item-selected" : ""
						}`}
						id="deployment"
						onClick={handleSideTabClick}
					>
						<Rocket className="group-hover:text-navy-500" />
						{isSidebarOpen && (
							<>
								<p className="text-md"> Deployment</p>
							</>
						)}
					</div>
					<div
						className={`sidebar-item group  ${
							localStorage.getItem("activenavlink") === "/finetuning" ? "sidebar-item-selected" : ""
						}`}
						id="finetuning"
						onClick={handleSideTabClick}
					>
						<Sliders className="group-hover:text-navy-500" />
						{isSidebarOpen && (
							<>
								<p className="text-md"> Finetuning</p>
							</>
						)}
					</div>
					<div
						className={`sidebar-item group  ${
							localStorage.getItem("activenavlink")?.startsWith("/promptstore")
								? "sidebar-item-selected"
								: ""
						}`}
						id="promptstore"
						onClick={handleSideTabClick}
					>
						<Warehouse className="group-hover:text-navy-500" />{" "}
						{isSidebarOpen && (
							<>
								<p className="text-md"> Prompt Store</p>
							</>
						)}
					</div>
					<div
						className={`sidebar-item group  ${localStorage.getItem("activenavlink") === "/logs" ? "sidebar-item-selected" : ""}`}
						id="logs"
						onClick={handleSideTabClick}
					>
						<FileClock className="group-hover:text-navy-500" />
						{isSidebarOpen && (
							<>
								<p className="text-md"> Logs</p>
							</>
						)}
					</div>
					<div
						className={`sidebar-item group  ${
							localStorage.getItem("activenavlink") === "/settings" ? "sidebar-item-selected" : ""
						}`}
						id="settings"
						onClick={handleSideTabClick}
					>
						<Key className="group-hover:text-navy-500" />
						{isSidebarOpen && (
							<>
								<p className="text-md"> API Key</p>
							</>
						)}
					</div>
					<div className="flex-grow"></div>
					<div>
						<a href="https://docs.simpliml.com" target="_blank">
							<div className="flex items-center gap-3 cursor-pointer group-hover:text-navy-500 p-2 rounded">
								<BookText />
								{isSidebarOpen && <div className="text-lg">Docs</div>}
							</div>
						</a>
					</div>
				</div>
			</div>
			<div
				className={`sticky top-0 left-0 ${isSidebarOpen ? " min-w-[13vw]" : " min-w-[5vw]"} h-screen z-[-3]`}
			></div>
			<div
				className={`fixed top-0 ${isSidebarOpen ? " left-[13vw] " : "left-[4vw]"} w-[2vw] h-screen flex items-center justify-center z-50`}
			>
				<div
					className="bg-navy-500 w-8 h-8 rounded-full p-1 cursor-pointer"
					onClick={toggleSidebar}
				>
					{isSidebarOpen ? <ArrowLeft size={23} /> : <ArrowRight size={23} />}
				</div>
			</div>
		</>
	)
}

export default Sidebar
