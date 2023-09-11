export default defineStore(
	'user',
	() => {
		const token = ref('')
		const isLoggedIn = ref(false)
		const idcbpf = ref('')
		const level = ref('')

		const setUserState = (
			tokenV: string,
			isLoggedInV: boolean,
			idcbpfV: string,
			levelV: string
		) => {
			token.value = tokenV
			isLoggedIn.value = isLoggedInV
			idcbpf.value = idcbpfV
			level.value = levelV
		}

		const clearUserState = () => {
			token.value = ''
			isLoggedIn.value = false
			idcbpf.value = ''
			level.value = ''
		}

		return {token, isLoggedIn, idcbpf, level, setUserState, clearUserState}
	},
	{persist: true}
)
