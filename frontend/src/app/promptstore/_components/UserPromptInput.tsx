import { Trash } from "lucide-react"
import { useRecoilState } from "recoil"

import { promptVariable, userPromptsAtom } from "@/utils/atoms"

const UserPromptInput = ({
	id,
	message,
	role,
}: {
	id: number
	message: string
	role: string
}) => {
	const [prompts, setPrompts] = useRecoilState(userPromptsAtom)
	const [promptVariables, setPromptVariables] = useRecoilState(promptVariable)

	const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPrompts((prevInput) => {
			return prevInput.map((item) =>
				item.id === id ? { ...item, role: e.target.value } : item,
			)
		})
	}

	const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		let _id: number = 0
		let content: string = ""
		setPrompts((prevInput) => {
			return prevInput.map((item) => {
				_id = item.id
				content = e.target.value
				return item.id === id ? { ...item, content: e.target.value } : item
			})
		})
		const regex = RegExp("{{([^}]+)}}", "g")
		let match
		let results: string[] = []
		while ((match = regex.exec(content))) {
			results.push(match[1])
		}
		setPromptVariables((prev) => {
			let flag = false
			const updatedState = prev.map((item) => {
				if (item.id === _id) {
					flag = true
					return { ...item, variables: results }
				}
				return item
			})
			if (!flag) {
				updatedState.push({ id: _id, variables: results })
			}
			return updatedState
			7
		})
	}

	const handlePromptDelete = () => {
		const updatedPrompts = prompts.filter((prompt) => prompt.id !== id)
		setPrompts(updatedPrompts)
	}

	return (
		<div className="bg-navy-800 px-4 rounded-lg">
			<div className="flex justify-between items-center">
				<div className="select">
					<select
						name="user_select"
						className="bg-transparent m-0"
						value={role}
						onChange={handleRoleChange}
					>
						<option value="user">User</option>
						<option value="assistant">Assistant</option>
					</select>
				</div>
				<Trash onClick={handlePromptDelete} />
			</div>
			<textarea
				rows={4}
				placeholder="Enter a user message. warp {variables } in double braces"
				value={message}
				onChange={handleMessageChange}
			/>
		</div>
	)
}

export default UserPromptInput
