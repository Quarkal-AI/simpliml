import { Check, Edit, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"

import API from "@/API/API"
import { systemPromptAtom, userPromptsAtom } from "@/utils/atoms"

export default function Store({ title, usage }: { title?: string; usage: string }) {
	const router = useRouter()
	const system = useRecoilValue(systemPromptAtom)
	const prompts = useRecoilValue(userPromptsAtom)
	const [editInputBox, setEditInputBox] = useState(false)
	const [promptTitle, setPromptTitle] = useState("Untitled")

	useEffect(() => {
		if (title) setPromptTitle(title)
	}, [])

	const handlePromptSave = async () => {
		if (promptTitle !== "Untitled") {
			let promptData
			promptData = [...prompts]
			if (system !== "")
				promptData = [
					{
						id: Math.floor(Math.random() * 200),
						role: "system",
						content: system,
					},
					...prompts,
				]
			const data = {
				prompt_name: promptTitle,
				prompt: promptData,
			}
			if (usage === "create") {
				await API.post("/prompt/create", data)
			} else if (usage === "edit") {
				const promptId = window.location.pathname.split("/").pop()
				await API.post("/prompt/edit", { ...data, prompt_id: promptId })
			}
			router.push("/promptstore")
		}
	}

	const handlePromptTitleEdit = () => {
		setPromptTitle((document.getElementById("prompt-title-input") as HTMLInputElement)?.value)
		setEditInputBox(false)
	}
	return (
		<div>
			<div id="model-dash-header" className="flex justify-between items-center">
				<div className="flex gap-2 items-center">
					{editInputBox ? (
						<div className="flex items-center gap-4">
							<input type="text" className="m-0" id="prompt-title-input" />
							<button
								className="p-2 rounded-full border border-gray-400"
								onClick={handlePromptTitleEdit}
							>
								<Check />
							</button>
							<button
								className="p-2 rounded-full border border-gray-400"
								onClick={() => setEditInputBox(false)}
							>
								<X />
							</button>
						</div>
					) : (
						<span className="flex items-center gap-4">
							<h1>{promptTitle}</h1>
							<Edit onClick={() => setEditInputBox(true)} />
						</span>
					)}
				</div>
				<div className="flex gap-2">
					<button className={"button-t1"} onClick={handlePromptSave}>
						Save <Save />
					</button>
				</div>
			</div>
		</div>
	)
}
