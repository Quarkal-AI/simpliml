import { Info } from "lucide-react"
import { useEffect, useState } from "react"

interface FormElementType {
	name: string
	type: string
	label: string
	value: string
	placeholder: string
	onChange: (value: string) => void
}

const FormElement = ({
	name,
	type,
	label,
	value,
	placeholder,
	onChange,
}: FormElementType) => {
	const [inputValue, setInputValue] = useState(value)

	useEffect(() => {
		value = inputValue
		onChange(value)
	}, [inputValue])

	return (
		<div>
			<label htmlFor={name}>
				{label} <Info size={15} />
			</label>
			<input
				type={type}
				name={name}
				placeholder={placeholder}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
			/>
		</div>
	)
}

export default FormElement
