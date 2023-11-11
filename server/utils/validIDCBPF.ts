export default (idcbpf: string): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		const ids = await idscbpf().catch(err => reject(err))
		if (ids && ids.length > 0)
			return resolve(ids.includes(idcbpf))
		return reject('Erro ao baixar idscbpf')
	})
}
