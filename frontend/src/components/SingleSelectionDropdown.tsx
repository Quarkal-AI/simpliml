import { useEffect } from "react"

export interface Data {
	label: string
	value: string
}

interface SingleSelectionDropdownProps {
	open: boolean
	data: Data[]
	selectedIndex: number
	showLabel?: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
	onChange?: (data: Data[], index: number) => void
	triggerFunction?: (data: Data[], choosenIndex: number) => unknown
}

export const SingleSelectionDropdown = ({
	open,
	data,
	selectedIndex,
	showLabel = true,
	setOpen,
	setSelectedIndex,
	onChange,
	triggerFunction,
}: SingleSelectionDropdownProps) => {
	useEffect(() => {
		if (onChange) onChange(data, selectedIndex)
	}, [selectedIndex])

	return (
		// w-full removed from first div
		<div className="flex justify-evenly">
			{showLabel === true && (
				<p className="text-sm ml-2">{data[selectedIndex].label}</p>
			)}
			{open === true && (
				<div className="absolute top-12 left-[5%] right-[5%] max-h-48 h-min  bg-[#0e1018] z-10 border-gray-600 border px-4 overflow-y-scroll w-[90%] rounded-xl">
					{data.map((entry, i) => {
						return (
							<div
								className="py-2 cursor-pointer"
								key={i}
								onClick={() => {
									setOpen(false)
									setSelectedIndex(i)

									if (triggerFunction != undefined) {
										triggerFunction(data, i)
									}
								}}
							>
								<p className="text-[0.9rem] font-medium opacity-90">
									{entry.label}
								</p>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
