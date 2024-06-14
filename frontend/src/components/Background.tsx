import Image from "next/image"

import wrinkles from "../../public/wrinkles.svg"

export default function Background() {
	return (
		<>
			<div
				style={{
					position: "fixed",
					top: "0%",
					left: "0%",
					zIndex: "-2",
				}}
			></div>
			<div
				style={{
					position: "fixed",
					top: "20%",
					right: "-35%",
					zIndex: "-2",
					borderRadius: "100%",
					overflow: "hidden",
					transform: "scaleX(-1)",
				}}
			>
				<Image src={wrinkles.src} width={"100"} height={"100"} alt="wrinkles" className="w-full" />
			</div>
			<div
				style={{
					position: "fixed",
					bottom: "0%",
					left: "0%",
					zIndex: "-2",
					transform: "scaleY(-1)",
				}}
			>
				<Image src={wrinkles.src} width={"80"} height={"80"} alt="wrinkles" className="w-full" />
			</div>
			<div
				style={{
					position: "fixed",
					bottom: "0%",
					right: "0%",
					zIndex: "-2",
					transform: "scaleX(-1) scaleY(-1)",
				}}
			>
				<Image src={wrinkles.src} width={"100"} height={"100"} alt="wrinkles" className="w-full" />
			</div>
		</>
	)
}
