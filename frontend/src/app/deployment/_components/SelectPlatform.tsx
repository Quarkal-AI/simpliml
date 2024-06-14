"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRecoilState, useSetRecoilState } from "recoil"

import { platformAtom, settingTabAtom } from "@/utils/atoms"

const SelectPlatform = () => {
	const router = useRouter()

	const setSettingTabState = useSetRecoilState(settingTabAtom)

	const [platform, setPlatform] = useRecoilState(platformAtom)

	const handlePlatformClick = (id: string) => {
		setPlatform({ platform: id })
	}

	const handleGoToSettings = () => {
		setSettingTabState("api_key")
		router.push(`/settings`)
	}

	return (
		<div className="mt-5 h-[45vh] flex flex-col text-center gap-4">
			<div className="flex justify-between gap-10">
				<div>
					<div
						className={`w-40 p-4 bg-black-800 rounded-md cursor-pointer ${
							platform.platform === "huggingface" ? "border border-navy-500" : ""
						}`}
						onClick={() => handlePlatformClick("huggingface")}
					>
						<Image
							src={
								"https://huggingface.co/datasets/huggingface/brand-assets/resolve/main/hf-logo.png"
							}
							alt={"huggingface"}
							width={150}
							height={100}
							className="object-contain rounded-full"
						/>
					</div>
					<h3 className="text-center my-2">HuggingFace</h3>
				</div>
				<div>
					<div className={" relative w-40 p-4 bg-black-800 rounded-md"}>
						<Image
							src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
							width={150}
							height={100}
							className="object-contain rounded-full"
							alt="github"
						/>
						<div
							className="absolute top-0 left-0 w-full h-full rounded-md flex justify-center items-center"
							style={{ backgroundColor: "rgba(21, 23, 31, 0.927)" }}
						>
							Coming soon
						</div>
					</div>
					<h3 className="text-center my-2">Github</h3>
				</div>
			</div>
			{platform.platform == "huggingface" && (
				<div className="text-xs flex flex-col items-center gap-2 mt-8">
					<p className=" w-[25vw] text-center mb-4">
						If your model is in private HuggingFace repo, please add HF Token in .env file
					</p>
				</div>
			)}
			{platform.platform == "github" && (
				<div className="text-xs flex flex-col items-center gap-2">
					<p className=" w-[25vw] text-center">
						If your model is in private Github repo, please Authenticate your Github account to
						access the model.
					</p>
					<button className="w-[50%] py-1 px-2 rounded-full border border-gray-500 whitespace-nowrap">
						Authenticate Github account
					</button>
				</div>
			)}
		</div>
	)
}

export default SelectPlatform
