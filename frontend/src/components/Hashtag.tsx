import Image from "next/image"

import horizontal_line from "../../public/horizontal_line.svg"
import verticle_line from "../../public/verticle_line.svg"

export default function Hashtag() {
	return (
		<>
			<div
				style={{
					width: "0.125%",
					overflow: "hidden",
					position: "absolute",
					top: "0px",
					left: "106.03px",
					opacity: "0.15",
					zIndex: "-1",
					height: "800px",
				}}
			>
				<Image
					src={verticle_line.src}
					width={"50"}
					height={"50"}
					alt="Verticle Lines"
				/>
			</div>
			<div
				style={{
					width: "0.125%",
					overflow: "hidden",
					position: "absolute",
					top: "0px",
					left: "248.3px",
					opacity: "0.15",
					zIndex: "-10",
					height: "800px",
				}}
			>
				<Image
					src={verticle_line.src}
					width={"50"}
					height={"50"}
					alt="Verticle Lines"
				/>
			</div>
			<div
				style={{
					width: "23.25rem",
					position: "absolute",
					top: "126px",
					left: "0px",
					opacity: "0.15",
					zIndex: "-10",
				}}
			>
				<Image
					src={horizontal_line.src}
					width={"100"}
					height={"100"}
					alt="Verticle Lines"
					className="w-full"
				/>
			</div>
			<div
				style={{
					width: "23.25rem",
					position: "absolute",
					top: "340px",
					left: "0px",
					opacity: "0.15",
					zIndex: "-10",
				}}
			>
				<Image
					src={horizontal_line.src}
					width={"100"}
					height={"100"}
					alt="Verticle Lines"
					className="w-full"
				/>
			</div>
			{/* #Tag On Right Side */}
			<div
				style={{
					width: "0.125%",
					overflow: "hidden",
					position: "absolute",
					top: "262px",
					right: "106.03px",
					opacity: "0.15",
					zIndex: "-1",
					height: "800px",
				}}
			>
				<Image
					src={verticle_line.src}
					width={"50"}
					height={"50"}
					alt="Verticle Lines"
				/>
			</div>
			<div
				style={{
					width: "0.125%",
					overflow: "hidden",
					position: "absolute",
					top: "262px",
					right: "248.3px",
					opacity: "0.15",
					zIndex: "-10",
					height: "800px",
				}}
			>
				<Image
					src={verticle_line.src}
					width={"50"}
					height={"50"}
					alt="Verticle Lines"
				/>
			</div>
			<div
				style={{
					width: "23.25rem",
					position: "absolute",
					top: "408px",
					right: "0px",
					opacity: "0.15",
					zIndex: "-10",
				}}
			>
				<Image
					src={horizontal_line.src}
					width={"100"}
					height={"100"}
					alt="Verticle Lines"
					className="w-full"
				/>
			</div>
			<div
				style={{
					width: "23.25rem",
					position: "absolute",
					top: "622px",
					right: "0px",
					opacity: "0.15",
					zIndex: "-10",
				}}
			>
				<Image
					src={horizontal_line.src}
					width={"100"}
					height={"100"}
					alt="Verticle Lines"
					className="w-full"
				/>
			</div>
		</>
	)
}
