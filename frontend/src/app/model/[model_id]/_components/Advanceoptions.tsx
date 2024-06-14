import Image from "next/image"

import styles from "@/styles/Explore/Explore.module.css"

import Hash from "../../../../../public/hash.svg"

interface actionType {
	type: string
	payload: string
}

interface state {
	max_tokens: string
	temperature: string
	top_p: string
	top_k: string
	repetition_penalty: string
}

interface MyComponentProps {
	state: state
	dispatch: React.Dispatch<actionType>
}
export default function Advanceoptions({ state, dispatch }: MyComponentProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		if (name === "temperature" || name === "top_p") {
			const number = parseFloat(value).toFixed(2)
			dispatch({ type: name, payload: `${number}` })
		} else {
			dispatch({ type: name, payload: value })
		}
	}

	return (
		<div>
			<div className="mt-8">
				<h3>Max Tokens</h3>
				<div
					className={`flex ${styles.promptInputContainer} justify-between items-center mt-4`}
				>
					<div>
						<input
							type="number"
							name="max_tokens"
							onChange={handleChange}
							value={state.max_tokens}
							className={`${styles.promptInputStyle}`}
							placeholder="500"
							min={16}
							max={1024}
						/>
					</div>
					<div>
						<Image
							src={Hash.src}
							width={"100"}
							height={"100"}
							alt="hash"
							className="w-full"
						/>
					</div>
				</div>
				<div className="mt-4 text-gray-400">
					<p>
						The maximum number of tokens that can be generated in the
						completion. The total length of input tokens and generated tokens is
						limited by the model&apos;s context length.
					</p>
				</div>
			</div>
			<div className="mt-8">
				<h3>Temperature</h3>
				<div
					className={`flex ${styles.promptInputContainer} justify-between items-center mt-4`}
				>
					<div>
						<input
							className={`${styles.promptInputStyle}`}
							type="number"
							step={0.1}
							name={"temperature"}
							onChange={handleChange}
							value={parseFloat(state.temperature)}
							min={0}
							max={2}
							placeholder="16.0"
						/>
					</div>
					<div>
						<Image
							src={Hash.src}
							width={"100"}
							height={"100"}
							alt="hash"
							className="w-full"
						/>
					</div>
				</div>
				<div className="mt-4 text-gray-400">
					<p>
						What sampling temperature to use, between 0 and 2. Higher values
						like 0.8 will make the output more random, while lower values like
						0.2 will make it more focused and deterministic.
					</p>
				</div>
			</div>
			<div className="mt-8">
				<h3>Top_p</h3>
				<div
					className={`flex ${styles.promptInputContainer} justify-between items-center mt-4`}
				>
					<div>
						<input
							className={`${styles.promptInputStyle}`}
							name="top_p"
							step={0.01}
							value={parseFloat(state.top_p)}
							onChange={handleChange}
							placeholder="0.9"
							type="number"
							min={0}
							max={1}
						/>
					</div>
					<div>
						<Image
							src={Hash.src}
							width={"100"}
							height={"100"}
							alt="hash"
							className="w-full"
						/>
					</div>
				</div>
				<div className="mt-4 text-gray-400">
					<p>
						An alternative to sampling with temperature, called nucleus
						sampling, where the model considers the results of the tokens with
						top_p probability mass. So 0.1 means only the tokens comprising the
						top 10% probability mass are considered.
					</p>
				</div>
			</div>
			<div className="mt-8">
				<h3>Top_k</h3>
				<div
					className={`flex ${styles.promptInputContainer} justify-between items-center mt-4`}
				>
					<div>
						<input
							className={`${styles.promptInputStyle}`}
							name="top_k"
							value={parseInt(state.top_k)}
							onChange={handleChange}
							placeholder="10"
							type="number"
							min={0}
							max={50}
						/>
					</div>
					<div>
						<Image
							src={Hash.src}
							width={"100"}
							height={"100"}
							alt="hash"
							className="w-full"
						/>
					</div>
				</div>
				<div className="mt-4 text-gray-400">
					<p>
						What top_k to use between 1 to 50. Integer that controls the number
						of top tokens to consider. Set to -1 to consider all tokens.
					</p>
				</div>
			</div>
		</div>
	)
}
