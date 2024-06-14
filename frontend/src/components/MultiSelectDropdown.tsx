import { useEffect, useState } from "react"

import { Filters } from "@/app/logs/"

interface MultiSelectDropdown {
	data: string[]
	open: boolean
	filters: Filters
	setFilters: React.Dispatch<React.SetStateAction<Filters>>
	field: "model" | "path" | "username"
}

export const MultiSelectDropdown = ({
	data,
	open,
	filters,
	setFilters,
	field,
}: MultiSelectDropdown) => {
	const [state, setState] = useState(() => {
		const set = new Set<string>()
		if (filters && filters[field].length > 0) {
			filters[field].map((entry: string) => set.add(entry))
		}
		return set
	})

	const addItem = (item: string) => {
		setState((prev) => new Set(prev).add(item))
	}

	const removeItem = (item: string) => {
		setState((prev) => {
			const next = new Set(prev)

			next.delete(item)

			return next
		})
	}

	const markCheckbox = (item: string) => {
		addItem(item)
	}

	const unmarkCheckbox = (item: string) => {
		removeItem(item)
	}

	const handleSubmit = () => {
		const updatedFieldValues: string[] = []
		state.forEach((f: string) => {
			updatedFieldValues.push(f)
		})

		setFilters({
			...filters,
			[field]: updatedFieldValues,
		})
	}

	const selectAll = () => {
		setState(new Set<string>())

		data.map((entry) => {
			addItem(entry)

			const ele: HTMLInputElement | null = document.getElementById(
				`${entry}-${field}-checkbox`,
			) as HTMLInputElement | null
			if (ele) ele.checked = true
		})
	}

	const clearAll = () => {
		setState(new Set<string>())

		data.map((entry) => {
			const ele: HTMLInputElement | null = document.getElementById(
				`${entry}-${field}-checkbox`,
			) as HTMLInputElement | null
			if (ele) ele.checked = false
		})
	}

	useEffect(() => {
		if (filters && filters[field].length > 0) {
			filters[field].map((entry) => addItem(entry))
		}
	}, [data])

	return (
		<div className="relative">
			{open && (
				<div className="absolute top-6 right-0 origin-top-right h-min max-h-80 w-52 backdrop-blur-3xl border-gray-600 border  px-4">
					{/* select all and clear all buttons */}
					<div className="flex h-7 mt-2 justify-between">
						<button className="pb-2" onClick={selectAll}>
							<p className="pb-2 underline opacity-80 text-sm font-normal">
								Select all
							</p>
						</button>
						&nbsp;&nbsp;
						<button className="pb-2" onClick={clearAll}>
							<p className="pb-2 underline opacity-80 font-normal text-sm">
								Clear
							</p>
						</button>
					</div>
					<div className="overflow-y-scroll h-min w-full mb-2 no-scrollbar">
						{/* TODO: searchbar */}
						{data.map((entry, index) => {
							return (
								<div className="w-full flex items-center my-2" key={index}>
									<input
										type="checkbox"
										id={`${entry}-${field}-checkbox`}
										className="w-min"
										style={{ background: "transparent", border: "none" }}
										defaultChecked={state.has(entry)}
										onChange={(e) => {
											if (e.target.checked) markCheckbox(entry)
											else if (!e.target.checked) unmarkCheckbox(entry)
										}}
									/>
									<label
										htmlFor="entry-checkbox"
										className="ml-2 text-sm -mt-2 font-normal normal-case opacity-90"
									>
										{entry}
									</label>
								</div>
							)
						})}
					</div>
					<div className="h-7 mb-2 text-center">
						<button
							onClick={handleSubmit}
							className="w-full py-1 rounded-3xl"
							style={{
								background: "linear-gradient(to right, #1440b5, #00aaf0)",
							}}
						>
							<span className="text-sm font-normal opacity-80">Submit</span>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
