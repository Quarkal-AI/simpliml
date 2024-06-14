import Image from "next/image"

import styles from "@/styles/Explore/Explore.module.css"

import loader from "../../../../../public/loader.svg"

export default function Outputloader() {
	return (
		<div className={`${styles.outputLoaderBackground} mt-4`}>
			<div className={`${styles.rotateTheLoading} w-1/12 mx-auto my-auto`}>
				<Image src={loader.src} width={"100"} height={"100"} alt="loader" />
			</div>
		</div>
	)
}
