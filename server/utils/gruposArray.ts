export default (uid: string): Promise<string[]> => {
	return new Promise(async (resolve, reject) => {
		const membroGrups: string[] = []
		const grupos = await fetchGrupos().catch((err) => reject(err))
		if (grupos) {
			for (const grupo of grupos)
				if ((await membrosGrupos(grupo.subgrupo, grupo.grupo)).includes(uid))
					membroGrups.push(`${grupo.subgrupo} - ${grupo.grupo}`)
			return resolve(membroGrups)
		}
		return reject('Erro ao baixar grupos')
	})
}
