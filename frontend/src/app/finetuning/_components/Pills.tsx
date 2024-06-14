import { X } from "lucide-react"

const Pills = ({ item, index, handleRemovePill }: any) => {
	return (
		<div className="p-1 bg-black-800 rounded-md flex items-center gap-1 flex-nowrap overflow-ellipsis">
			{item.length > 5 ? `${item.slice(0, 5)}...` : item}

			<X
				size={10}
				className="cursor-pointer"
				onClick={() => handleRemovePill(index)}
			/>
		</div>
	)
}

export default Pills
