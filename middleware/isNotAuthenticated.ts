export default defineNuxtRouteMiddleware(async () => {
	if (await useCheckAuth())
		return navigateTo('/')
	userStore().clearUserState()
})
