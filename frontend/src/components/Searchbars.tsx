import { Search } from "lucide-react"
import { useRecoilState } from "recoil"

import API from "@/API/API"
import { searchModelAtom } from "@/utils/atoms"

export interface ModelSearchResultType {
	image: string
	author: string
	deployment_name: string
	description: string
	created_at: string
	license: string
	status: string
}

export const SearchBar = () => {
	const [_, setSearchResult] = useRecoilState(searchModelAtom)

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target

		if (value.length > 1) {
			const response = await API.post(`/models/search/${value}`, {
				is_public: false,
			})

			const { hits } = response.data.data
			setSearchResult(hits)
		} else {
			setSearchResult([])
		}
	}

	return (
		<div>
			<div className="glass rounded-full p-1 flex z-10 text-navy-800">
				<input
					type="text"
					className="text-white m-0 px-2 w-full rounded-full outline-none bg-transparent"
					style={{ border: "0" }}
					placeholder="Search"
					onChange={handleChange}
				/>
				<div className="p-3 flex justify-center items-center rounded-full text-white back-gradient ">
					<Search size={20} />
				</div>
			</div>
		</div>
	)
}
