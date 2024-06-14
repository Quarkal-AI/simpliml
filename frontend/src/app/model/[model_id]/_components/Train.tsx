import { AreaChart, BookText, GitMerge, Monitor, Play } from "lucide-react"

import styles from "@/styles/Explore/Explore.module.css"

import { Tabs } from "../page"

interface MyComponentProps {
	currentTab: Tabs
	setCurrentTab: React.Dispatch<React.SetStateAction<Tabs>>
}

export default function Explore({ currentTab, setCurrentTab }: MyComponentProps) {
	return (
		<>
			<div className={`flex items-center mt-8 ${styles.devOptionWholeContainer} m-auto`}>
				<div
					onClick={() => setCurrentTab("run")}
					className={`flex items-center justify-center space-x-2 cursor-pointer ${
						styles.runContainerSize
					} ${currentTab === "run" ? styles.devOptionContainerBackground : ""} rounded-full`}
				>
					<div className={`${styles.runImageContainer}`}>
						<Play />
					</div>
					<div className="pl-2 text-lg">Run</div>
				</div>
				<div
					onClick={() => setCurrentTab("docs")}
					className={`flex items-center justify-center space-x-2 cursor-pointer ${
						styles.apiDocsContainerSize
					} ${currentTab === "docs" ? styles.devOptionContainerBackground : ""} rounded-full`}
				>
					<div className={`${styles.runImageContainer}`}>
						<BookText />
					</div>
					<div className="pl-2 text-lg">API Docs</div>
				</div>
			</div>
		</>
	)
}
