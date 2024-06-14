export interface Response<T> {
	success: boolean
	data?: T
	message?: string
}

export interface Rowtypes {
	link?: string
	checkbox?: boolean
	value: Array<string | { type: string; value: string; stopPropogation: boolean }>
	user_id?: string
	model_id?: string
	name?: string
	id?: string
	pipeline_id?: string
}

export interface Tabletypes {
	from: string
	tableWidth: string
	columns: { name: string }[]
	rows: Row[]
	setPipelineId?: React.Dispatch<React.SetStateAction<string>>
	setPopupDisplay?: React.Dispatch<React.SetStateAction<string>>
	setModalDeployForm?: React.Dispatch<React.SetStateAction<boolean>>
	setDeleteUserList?: React.Dispatch<React.SetStateAction<string[]>>
	setShowHideEditModal?: React.Dispatch<React.SetStateAction<boolean>>
	setEditUser?: React.Dispatch<React.SetStateAction<string>>
}
