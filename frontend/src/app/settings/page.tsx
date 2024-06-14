"use client"

import { useRecoilState } from "recoil"

import Background from "@/components/Background"
import Sidebar from "@/components/Sidebar"
import { settingTabAtom } from "@/utils/atoms"

import ApiKeySettings from "./_components/ApiKeySettings"

const Page = () => {
	const [settingTabState] = useRecoilState(settingTabAtom)
	return (
		<div className="relative flex">
			<Sidebar />
			<div className="w-full pt-[4vh] px-8 flex flex-col gap-8 overflow-x-hidden">
				{settingTabState === "api_key" && <ApiKeySettings />}
			</div>
			<Background />
		</div>
	)
}

export default Page
