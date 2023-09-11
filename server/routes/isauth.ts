export default defineEventHandler(async (event) => {
	const {user} = event.context
	if (user) return user.authenticated
	return false
})
