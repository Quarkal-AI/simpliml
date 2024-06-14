import Hashtag from "../../public/hash.svg"
import prompt_input from "../../public/prompt_input.svg"

export const data1 = [
	{
		data: "prompt",
		data_type: "string",
		description: "Prompt",
		image: prompt_input,
	},
]
export const data2 = [
	{
		data: "max_tokens",
		data_type: "integer",
		description: "Max number of token to return",
		image: Hashtag,
		default_value: "500",
	},
	{
		data: "temperature",
		data_type: "number",
		description: "Temperature",
		image: Hashtag,
		default_value: "0.8",
	},
	{
		data: "top_p",
		data_type: "number",
		description: "Top P",
		image: Hashtag,
		default_value: "0.95",
	},
	{
		data: "top_k",
		data_type: "integer",
		description: "Top P",
		image: Hashtag,
		default_value: "10",
	},
	{
		data: "repetition_penalty",
		data_type: "number",
		description: "Repetition Penalty",
		image: Hashtag,
		default_value: "1.0",
	},
]
