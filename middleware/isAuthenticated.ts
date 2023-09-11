export default defineNuxtRouteMiddleware(async (to) => {
	if (await useCheckAuth()) {
		if (['Administrador', 'Auditor'].includes(userStore().level)) return
		if (to.fullPath === `/usuarios/${userStore().idcbpf}`) return
		return navigateTo(`/usuarios/${userStore().idcbpf}`)
	} else {
		userStore().clearUserState()
		return navigateTo('/login')
	}
})
