import Image from "next/image"

import styles from "@/styles/Explore/Explore.module.css"

import Copy from "../../../../../public/copy.svg"
import Pen from "../../../../../public/pen.svg"

interface MyComponentProps {
	deployment_name: string | undefined
}

export default function Heading({ deployment_name }: MyComponentProps) {
	const copyText = (id: string) => {
		const element: any = document.getElementById(id)
		var tempInput = document.createElement("input")
		tempInput.value = element.innerText
		document.body.appendChild(tempInput)
		tempInput.select()
		document.execCommand("copy")
		document.body.removeChild(tempInput)
	}

	return (
		<>
			<div className="flex justify-center items-center space-x-8">
				<div>
					<h1 id="mainHeading" className="text-4xl">
						<span className={`${styles.colorFirstHeading}`}>
							{deployment_name}
						</span>{" "}
					</h1>
				</div>
				<div
					onClick={() => copyText("mainHeading")}
					className={`${styles.copyImageContainer} cursor-pointer`}
				>
					<Image
						src={Copy.src}
						width={"100"}
						height={"100"}
						alt="copy"
						className={`${styles.copyImageSize}`}
					/>
				</div>
			</div>
		</>
	)
}
