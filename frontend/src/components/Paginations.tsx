import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import API from "@/API/API"
import { errorHandler } from "@/utils/errorHandler"

import styles from "../styles/Explore.module.css"

export default function Pagination({
	setId,
	is_public,
}: {
	setId: React.Dispatch<React.SetStateAction<number>>
	is_public: boolean
}) {
	const router = useRouter()

	const [start, setStart] = useState(1)
	const [current, setCurrent] = useState(1)
	const [end, setEnd] = useState(10)

	const pagination = new Array(end).fill(0)

	const getPaginationCount = async () => {
		try {
			const response = await API.post(`/models/model_count`, {
				is_public: is_public,
			})
			const { data } = response.data
			setEnd(data)
		} catch (error: unknown) {
			errorHandler(error, router)
		}
	}

	const decrease = () => {
		if (current === start) {
			if (current > 1) {
				setStart((prev) => prev - 1)
				setCurrent((prev) => prev - 1)
				setId((prev) => prev - 1)
			}
		} else {
			if (current > 1) {
				setCurrent((prev) => prev - 1)
				setId((prev) => prev - 1)
			}
		}
	}

	const increase = () => {
		if (current === start + 9 && current !== end) {
			setStart((prev) => prev + 1)
			setId((prev) => prev + 1)
		} else {
			if (current < end) {
				setCurrent((prev) => prev + 1)
				setId((prev) => prev + 1)
			}
		}
	}

	const selectPageNumber = (value: number) => {
		setId(value)
		setCurrent(value)
	}

	useEffect(() => {
		getPaginationCount()
	}, [])
	return (
		<>
			<div className={`flex justify-center p-4 gap-4 mt-32`}>
				<div
					className={`p-1 border flex justify-center items-center rounded-full w-20 ${styles.linearGradient}`}
					onClick={decrease}
					style={{ width: "2rem", height: "2rem" }}
				>
					<ChevronLeft color="white" size={20} />
				</div>
				{pagination?.map((data, index) => {
					return (
						<div
							className={`border flex justify-center rounded-full w-20 items-center ${
								current === start + index ? styles.linearGradient : ""
							}`}
							key={index}
							style={{ width: "2rem", height: "2rem" }}
							onClick={() => selectPageNumber(start + index)}
						>
							<span style={{ fontSize: "1rem" }}>{start + index}</span>
						</div>
					)
				})}
				<div
					className={`p-1 border flex justify-center items-center rounded-full w-20 ${styles.linearGradient}`}
					onClick={increase}
					style={{ width: "2rem", height: "2rem" }}
				>
					<ChevronRight color="white" size={20} />
				</div>
			</div>
		</>
	)
}
