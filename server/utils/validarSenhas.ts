export default (senhaText: string, senhasLdap: string[]): Promise<boolean> => {
	return new Promise(async (resolve) => {
		let valido = false
		for (const senhaCrypt of senhasLdap) {
			const hashType = senhaCrypt.match(/\{([^}]+)\}/)
			if (hashType && hashType[1] === 'CRYPT')
				if (await verifySha512(senhaText, senhaCrypt)) valido = true
			if (hashType && hashType[1] === 'SSHA')
				if (gerarSSHA(senhaText, senhaCrypt) === senhaCrypt) valido = true
		}
		return resolve(valido)
	})
}
