import styles from "@/styles/Explore/Explore.module.css"

interface actionType {
	type: string
	payload: string
}

interface state {
	max_tokens: string
	temperature: string
	top_p: string
	top_k: string
	repetition_penalty: string
	// frequency_penalty: string;
	// presence_penalty: string;
}

interface MyComponentProps {
	state: state
	dispatch: React.Dispatch<actionType>
}

export default function Frequencyandmirostat({
	state,
	dispatch,
}: MyComponentProps) {
	// const [mirostatDisplay, setMirostatDisplay] = useState("none");
	return (
		<div>
			<div className="mt-8">
				<div className="flex justify-between">
					<h3>Repetition_penalty</h3>
					<p>(minimum:0; maximum:2)</p>
				</div>
				<div className={`flex justify-between items-center mt-4`}>
					<div
						className={`${styles.frequencyInputContainer} flex items-center`}
					>
						<input
							type="number"
							min={0}
							step={0.1}
							max={2}
							placeholder="0"
							value={parseFloat(state.repetition_penalty)}
							onChange={(e) => {
								dispatch({
									type: "repetition_penalty",
									payload: `${e.target.value}`,
								})
							}}
							className={`${styles.frequencyInputStyle}`}
						/>
					</div>
					<div className={`w-1/2`}>
						<input
							type="range"
							min={0}
							step={0.1}
							max={2}
							value={parseFloat(state.repetition_penalty)}
							onChange={(e) =>
								dispatch({
									type: "repetition_penalty",
									payload: `${e.target.value}`,
								})
							}
							className={`${styles.frequencyInputRangeStyle}`}
						/>
					</div>
				</div>
				<div className="mt-2 text-gray-400">
					<p>
						Float Number that penalizes new tokens based on whether they appear
						in the prompt and the generated text so far. Values &gt; 1 encourage
						the model to use new tokens, while values &lt; 1 encourage the model
						to repeat tokens.
					</p>
				</div>
			</div>
			{/* <div className="mt-8">
        <div className="flex justify-between">
          <h3>Presence_penalty</h3>
          <p>(minimum:-2; maximum:2)</p>
        </div>
        <div className={`flex justify-between items-center mt-4`}>
          <div
            className={`${styles.frequencyInputContainer} flex items-center`}
          >
            <input
              type="number"
              min={-2}
              max={2}
              onChange={(e) => {
                dispatch({
                  type: "presence_penalty",
                  payload: `${e.target.value}`,
                });
              }}
              value={parseInt(state.presence_penalty)}
              placeholder="0"
              className={`${styles.frequencyInputStyle}`}
            />
          </div>
          <div className={`w-1/2`}>
            <input
              type="range"
              min={-2}
              max={2}
              onChange={(e) => {
                dispatch({
                  type: "presence_penalty",
                  payload: `${e.target.value}`,
                });
              }}
              value={parseInt(state.presence_penalty)}
              className={`${styles.frequencyInputRangeStyle}`}
            />
          </div>
        </div>
        <div className="mt-2 text-gray-400">
          <p>Presence Penalty</p>
        </div>
      </div> */}
			{/* <div className="mt-8">
        <div className="flex justify-between">
          <h1>Repetition_penalty</h1>
          <p>(minimum:0; maximum:2)</p>
        </div>
        <div className={`flex justify-between items-center mt-4`}>
          <div
            className={`${styles.frequencyInputContainer} flex items-center`}
          >
            <input
              type="number"
              min={0}
              max={2}
              placeholder="0"
              className={`${styles.frequencyInputStyle}`}
            />
          </div>
          <div className={`w-1/2`}>
            <input
              type="range"
              min={0}
              max={2}
              defaultValue={1}
              className={`${styles.frequencyInputRangeStyle}`}
            />
          </div>
        </div>
        <div className="mt-2 text-gray-400">
          <p>Repetition Penalty</p>
        </div>
      </div> */}
			{/* <div className="mt-8">
        <div>
          <p>Mirostat mode</p>
        </div>
        <div
          onClick={() => setMirostatDisplay(mirostatDisplay === 'none' ? 'block' : 'none')}
          className={`flex justify-between items-center ${styles.promptInputContainer} mt-4`}
        >
          <div>Disabled</div>
          <div>
            <Image
              src={arrow_up.src}
              width={"100"}
              height={"100"}
              alt="arrow_up"
              className="w-full"
            />
          </div>
        </div>
        <div className="mt-2 text-gray-400">
          <p>Mirostat Sampling Mode</p>
        </div>
        {mirostatDisplay === 'block' && <Mirostat />}
      </div> */}
		</div>
	)
}
