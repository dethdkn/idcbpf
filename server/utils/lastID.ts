export default (): Promise<number> => {
	return new Promise(async (resolve, reject) => {
		const uids: number[] = []
		ldapClient.search(
			LDAP_PEOPLE_DN,
			{filter: '(uid=*)', scope: 'sub', attributes: ['uidNumber']},
			(err, res) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro na busca de ids dos idscbpf ldap',
							err
						}
					}).save()
					return reject('Erro ao baixar ids dos usuários')
				}
				res.on('searchEntry', (entry) => {
					if (entry.pojo.attributes[0] && entry.pojo.attributes[0].values)
						uids.push(Number(entry.pojo.attributes[0].values[0]))
				})
				res.on('error', (error) => {
					new Erro({
						erro: {
							info: 'Erro na busca de ids dos idscbpf ldap',
							error
						}
					}).save()
					return reject('Erro ao baixar ids dos usuários')
				})
				res.on('end', () => {
					return resolve(Math.max(...uids) + 1)
				})
			}
		)
	})
}
