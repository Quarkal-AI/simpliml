import { Plus } from "lucide-react"
import { useState } from "react"
import { useRecoilState } from "recoil"

import {
	promptVariable,
	systemPromptAtom,
	userPromptsAtom,
} from "@/utils/atoms"

import UserPromptInput from "./UserPromptInput"

export default function Prompts() {
	const [prompts, setPrompts] = useRecoilState(userPromptsAtom)
	const [system, setSystem] = useRecoilState(systemPromptAtom)
	const [userInputs, setUserInputs] = useState(prompts?.length)
	const [promptVariables, setPromptVariables] = useRecoilState(promptVariable)
	const renderUserInputDiv = (e: React.MouseEvent) => {
		e.preventDefault()
		setUserInputs(userInputs + 1)
		setPrompts((prev) => [
			...prev,
			{ id: Math.floor(Math.random() * 200), role: "user", content: "" },
		])
	}
	const handleSystemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let content: string = e.target.value
		setSystem(e.target.value)
		const regex = RegExp("{{([^}]+)}}", "g")
		let match
		let results: string[] = []
		while ((match = regex.exec(content))) {
			results.push(match[1])
		}
		setPromptVariables((prev) => {
			let flag = false
			const updatedState = prev.map((item) => {
				if (item.id === -1) {
					flag = true
					return { ...item, variables: results }
				}
				return item
			})
			if (!flag) {
				updatedState.push({ id: -1, variables: results })
			}
			return updatedState
		})
	}
	return (
		<div className=" overflow-y-scroll col-span-2 border-r border-white border-opacity-20 flex flex-col gap-4 p-4">
			<h2>Prompt</h2>
			<div className="bg-navy-800 p-4 rounded-lg">
				<h3>System</h3>
				<input type="text" value={system} onChange={handleSystemChange} />
			</div>
			{prompts?.map((item, index) => (
				<UserPromptInput
					key={index}
					id={item.id}
					message={item.content}
					role={item.role}
				/>
			))}
			<div className="flex justify-between">
				<a
					href=""
					className="flex gap-2 text-navy-700"
					onClick={renderUserInputDiv}
				>
					Add Message <Plus />
				</a>
			</div>
		</div>
	)
}
