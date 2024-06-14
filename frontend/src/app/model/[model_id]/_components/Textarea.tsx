import Image from "next/image"

import styles from "@/styles/Explore/Explore.module.css"

import prompt_input from "../../../../../public/prompt_input.svg"

interface MyComponentProps {
	row: number
	prompt: string
	promptInput: string
	setPromptInput: React.Dispatch<React.SetStateAction<string>>
	setPrompt: React.Dispatch<React.SetStateAction<string>>
}

export default function Textarea({
	row,
	setPrompt,
	promptInput,
	prompt,
	setPromptInput,
}: MyComponentProps) {
	return (
		<>
			<div
				className={`${styles.promptInputContainer} mt-4 flex justify-between`}
			>
				<div className={`${styles.promptInputTextareaContainer}`}>
					<textarea
						onChange={(e) => {
							setPromptInput(e.target.value)
						}}
						rows={row}
						className={`${styles.promptInputStyle}`}
						value={promptInput}
					/>
				</div>
				<div>
					<Image
						src={prompt_input.src}
						width={"100"}
						height={"100"}
						alt="prompt"
						className="w-full"
					/>
				</div>
			</div>
		</>
	)
}
