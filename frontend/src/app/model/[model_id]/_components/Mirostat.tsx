import styles from "@/styles/Explore/Explore.module.css"

export default function Mirostat() {
	return (
		<div>
			<div className="mt-12">
				<div className="flex justify-between">
					<h1>Mirostat_learning_rate</h1>
					<p>(minimum:0; maximum:1)</p>
				</div>
				<div className={`flex justify-between items-center mt-4`}>
					<div
						className={`${styles.frequencyInputContainer} flex items-center`}
					>
						<input
							type="number"
							min={0}
							max={1}
							placeholder="0"
							className={`${styles.frequencyInputStyle}`}
						/>
					</div>
					<div className={`w-1/2`}>
						<input
							type="range"
							min={0}
							max={1}
							defaultValue={1}
							className={`${styles.frequencyInputRangeStyle}`}
						/>
					</div>
				</div>
				<div className="mt-2 text-gray-400">
					<p>Mirostat learning rate, if mirostat_mode is not Disabled</p>
				</div>
			</div>
			<div className="mt-12">
				<div className="flex justify-between">
					<h1>Mirostat_entropy</h1>
					<p>(minimum:0; maximum:10)</p>
				</div>
				<div className={`flex justify-between items-center mt-4`}>
					<div
						className={`${styles.frequencyInputContainer} flex items-center`}
					>
						<input
							type="number"
							min={0}
							max={10}
							placeholder="0"
							className={`${styles.frequencyInputStyle}`}
						/>
					</div>
					<div className={`w-1/2`}>
						<input
							type="range"
							min={0}
							max={10}
							defaultValue={1}
							className={`${styles.frequencyInputRangeStyle}`}
						/>
					</div>
				</div>
				<div className="mt-2 text-gray-400">
					<p>Mirostat target entropy</p>
				</div>
			</div>
		</div>
	)
}
