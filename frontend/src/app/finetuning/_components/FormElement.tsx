import { Info } from "lucide-react"
import { ChangeEvent, useState } from "react"

interface FormElementType {
	name: string
	type: string
	label: string
	value: string | number
	placeholder: string
	width: string
	readOnly: boolean | undefined
	onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const FormElement = ({
	name,
	type,
	label,
	value,
	placeholder,
	onChange,
	readOnly = false,
	width,
}: FormElementType) => {
	const [inputValue, setInputValue] = useState(value)

	return (
		<div>
			<label htmlFor={name}>
				{label} <Info size={15} />
			</label>
			<input
				style={{ width: width }}
				type={type}
				name={name}
				placeholder={placeholder}
				value={inputValue}
				onChange={(e) => {
					setInputValue(e.target.value)
					onChange(e)
				}}
				readOnly={readOnly}
			/>
		</div>
	)
}

export default FormElement
