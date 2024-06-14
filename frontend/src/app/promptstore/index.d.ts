export interface chatType {
	id?: number
	role: string
	content: string
}

export interface actionType {
	type: string
	payload: string
}
export interface responseSendMessage {
	result: string
}
