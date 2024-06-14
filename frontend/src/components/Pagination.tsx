interface props {
	moveToNextPage: () => void
	moveToPreviousPage: () => void
	current: number
	total: number
}
export default function Pagination({
	moveToNextPage,
	moveToPreviousPage,
	current,
	total,
}: props) {
	return (
		<div className="pt-4 flex justify-center">
			{current > 1 && (
				<button
					className="mr-2 bg-navy-500 px-2 py-0.5 text-sm rounded"
					onClick={moveToPreviousPage}
				>
					Prev
				</button>
			)}
			<p className="text-center opacity-80">
				Page {current} of {total}
			</p>
			{current < total && (
				<button
					className="ml-2 bg-navy-500 px-2 py-0.5 text-sm rounded"
					onClick={moveToNextPage}
				>
					Next
				</button>
			)}
		</div>
	)
}
