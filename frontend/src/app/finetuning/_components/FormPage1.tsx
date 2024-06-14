"use client"

import { ChangeEvent } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"

import { datasetFormAtom } from "@/utils/atoms"

import huggingface from "../../../../public/huggyface.svg"
import styles from "../../../styles/Finetuning/Finetuning.module.css"

const FormPage1 = () => {
	const datasetFormState = useSetRecoilState(datasetFormAtom)
	const datasetForm = useRecoilValue(datasetFormAtom)
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		datasetFormState((prevState) => {
			return {
				...prevState,
				dataset_id: event.target.value,
			}
		})
	}

	return (
		<div className="flex justify-center flex-row">
			<div
				className={`border border-solid border-white border-opacity-20 w-1/2 py-4 ${styles.modelStep1ContainerLayout} space-y-12 flex flex-col justify-center`}
			>
				<div className={`flex flex-col justify-center items-center space-y-4 p-4`}>
					<div className="mt-4">
						<img src={huggingface?.src} width={"100"} height={"100"} alt="User" />
					</div>
					<div>
						<p>Provide The HF Dataset ID</p>
					</div>
					<div className="px-4">
						<input
							type="text"
							name="dataset_id"
							placeholder="HuggingFace Dataset ID"
							onChange={handleChange}
							value={datasetForm.dataset_id}
						/>
						<p className="text-red-700 text-sm">
							Note: Only alpaca datasets are currently supported, support for other datasets are
							coming soon
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default FormPage1
