import Image from "next/image"

import loader from "../../public/loader.svg"
import styles from "../styles/Loader/Loader.module.css"

export default function Loader() {
	return (
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
			<div className={`${styles.rotateTheLoading} w-1/2 m-auto`}>
				<Image src={loader.src} width={"100"} height={"100"} alt="" />
			</div>
		</div>
	)
}
