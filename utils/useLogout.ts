export default (): void => {
	userStore().clearUserState()
	navigateTo('/login')
}
