import { Search } from "lucide-react"

interface props {
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	placeholder: string
}

export default function Searchbar({ handleChange, placeholder }: props) {
	return (
		<div className={`glass rounded-full p-[0.1rem] flex text-navy-800 w-96`}>
			<input
				onChange={handleChange}
				type="text"
				className="text-white m-0 px-2 w-full rounded-full outline-none bg-transparent"
				placeholder={placeholder}
			/>
			<div className="p-3 m-[0.05rem] flex justify-center items-center rounded-full text-white back-gradient ">
				<Search size={20} />
			</div>
		</div>
	)
}
