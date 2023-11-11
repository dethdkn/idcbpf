export default (uid: string): Promise<string[]> => {
	return new Promise(async (resolve, reject) => {
		const membroCoord: string[] = []
		const coordenacoes = await fetchCoordenacoes().catch(err => reject(err))
		if (coordenacoes) {
			for (const coordenacao of coordenacoes) {
				if ((await membrosCoordenacoes(coordenacao.cn)).includes(uid))
					membroCoord.push(coordenacao.cn)
			}
			return resolve(membroCoord)
		}
		return reject('Erro ao baixar coordenações')
	})
}
