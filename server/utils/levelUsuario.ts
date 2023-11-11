export default (idcbpf: string): Promise<'Administrador' | 'Moderador' | 'Auditor' | ''> => {
	return new Promise(async (resolve, reject) => {
		let level: 'Administrador' | 'Moderador' | 'Auditor' | '' = ''
		const auds = await membrosGrupos('auditor', 'contas').catch((err) => {
			return reject(err)
		})
		const mods = await membrosGrupos('moderador', 'contas').catch((err) => {
			return reject(err)
		})
		const adms = await membrosGrupos('administrador', 'contas').catch((err) => {
			return reject(err)
		})
		if (auds) {
			if (auds.includes(idcbpf))
				level = 'Auditor'
		}
		if (mods) {
			if (mods.includes(idcbpf))
				level = 'Moderador'
		}
		if (adms) {
			if (adms.includes(idcbpf))
				level = 'Administrador'
		}
		return resolve(level)
	})
}
