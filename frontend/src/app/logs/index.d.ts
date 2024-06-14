export interface Logs {
	"@timestamp": string
	fields: {
		meta: {
			trace_id?: string
			total_tokens?: number
			requestBody?: {
				max_tokens: number
			}
			req?: {
				url: string
				headers?: {
					metadata?: {
						_user?: string
					}
				}
				model?: string
				server?: string
			}
			res?: {
				statusCode: number
			}
			user?: {
				model: string
			}
			feedback_count?: string
		}
	}
}

export interface ExportData {
	timestamp?: string
	trace_id?: string
	feedback_count?: string
	path_url?: string
	request?: string
	response?: string
	user?: string
	model?: string
	response_time?: string
	prompt_tokens?: string
	completion_tokens?: string
}

export interface IUniqueField {
	doc_count: string
	key: string
}

export interface Filters {
	interval: "15m" | "60m" | "24h" | "7d" | "14d" | "30d" | "90d"
	model: string[]
	path: string[]
	username: string[]
}
