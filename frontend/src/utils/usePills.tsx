import { ChangeEvent, ReactEventHandler, useState } from "react"

const usePills = () => {
	const [inputVal, setInputVal] = useState("")
	const [pills, setPills] = useState<string[]>([])

	const handlePills = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setInputVal(e.target.value)

		const valueArray = inputVal.split(",")
		const validWords = valueArray.filter((word) => word.trim() !== " ")

		if (valueArray.length > 1) {
			setPills((prevArray) => [...prevArray, validWords[0]])
			setInputVal("")
			e.target.value = ""
		}
	}

	const handleRemovePill = (index: number) => {
		setPills((prevPills) => {
			const updatedPills = [...prevPills]
			updatedPills.splice(index, 1)
			return updatedPills
		})
	}

	return {
		inputVal,
		pills,
		handlePills,
		handleRemovePill,
	}
}

export default usePills
