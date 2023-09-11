export default defineEventHandler(async (event) => {
	let decodedToken: TokenUsuario | null = null
	const userCookie = getCookie(event, 'user') || ''
	if (userCookie) {
		const token = JSON.parse(userCookie).token
		if (token) decodedToken = await decodeToken(token)
	}
	if (decodedToken) {
		event.context.user = decodedToken
	} else {
		event.context.user = null
	}
})
