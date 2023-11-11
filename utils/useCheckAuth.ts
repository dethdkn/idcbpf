export default (): Promise<boolean> => {
	return new Promise(async (resolve) => {
		const { data } = await useFetch('/isauth')
		if (data.value !== null)
			return resolve(data.value)
		return resolve(false)
	})
}
