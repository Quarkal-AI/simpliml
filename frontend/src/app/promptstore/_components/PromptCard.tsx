import { Check, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useRecoilState } from "recoil"

import { checkedPromptsAtom, editPromptAtom, promptVariable, userPromptsAtom } from "@/utils/atoms"

export interface PromptType {
	id: string
	name: string
	prompt: { id: number; content: string; role: string }[]
	updated_at: string
}

const PromptCard = ({ data }: { data: PromptType }) => {
	// console.log(data)
	const router = useRouter()
	const [prompts, setPrompts] = useRecoilState(userPromptsAtom)
	const [editPrompt, setEditPrompt] = useRecoilState(editPromptAtom)
	const [promptVariables, setPromptVariables] = useRecoilState(promptVariable)
	const [selectedElements, setSelectedElements] = useRecoilState(checkedPromptsAtom)
	const [check, setCheck] = useState(false)

	const handlePromptSelection = () => {
		if (selectedElements.includes(data.id)) {
			setSelectedElements((prev) => prev.filter((id) => id !== data.id))
		} else {
			setSelectedElements((prev) => [...prev, data.id])
		}
	}

	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation()
		setCheck(true)
		navigator.clipboard.writeText(data.id)
		setTimeout(() => {
			setCheck(false)
		}, 1000)
	}

	const handlePromptClick = () => {
		setEditPrompt(data)
		setPromptVariables([])
		data?.prompt?.forEach((data) => {
			if (data.role !== "system") {
				const regex = RegExp("{{([^}]+)}}", "g")
				let match
				let results: string[] = []
				while ((match = regex.exec(data.content))) {
					results.push(match[1])
				}
				setPromptVariables((prev) => {
					return [
						...prev,
						{
							id: data.id,
							variables: results,
						},
					]
				})
			}
		})
		router.push(`/promptstore/edit/${data.id}`)
	}

	return (
		<div
			className="glass rounded-xl w-full p-4 flex flex-col gap-4 cursor-pointer"
			onClick={handlePromptClick}
		>
			<div className="flex justify-between">
				<div className="flex gap-2 items-center">
					<input
						type="checkbox"
						className="m-0"
						onChange={handlePromptSelection}
						onClick={(e) => e.stopPropagation()}
						checked={selectedElements.includes(data.id)}
					/>
					<h3 className="whitespace-nowrap">{data.name}</h3>
				</div>
				<p className="flex gap-4 opacity-75">
					<p>Last updated: {data.updated_at?.split("T")[0]}</p>
					id: {data.id}
					{check ? <Check color="green" /> : <Copy onClick={handleCopy} />}
				</p>
			</div>
			<p>
				{data.prompt?.map((item, index) => {
					return (
						<div className="pr-16" key={index}>
							<span className=" text-navy-500">{item.role}:</span>
							{item.content}
						</div>
					)
				})}
			</p>
		</div>
	)
}

export default PromptCard
