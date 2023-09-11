declare global {
	interface ErroReq {
		message: string
		stack: string
		statusCode: number
		statusMessage: string
		url: string
	}
}

export {ErroReq}
