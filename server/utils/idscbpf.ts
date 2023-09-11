export default (): Promise<string[]> => {
	return new Promise(async (resolve, reject) => {
		const users: string[] = []
		ldapClient.search(
			LDAP_PEOPLE_DN,
			{filter: '(uid=*)', scope: 'sub', attributes: ['uid']},
			(err, res) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro na busca de idscbpf ldap',
							err
						}
					}).save()
					return reject('Erro ao baixar usuários')
				}
				res.on('searchEntry', (entry) => {
					users.push(entry.pojo.attributes[0].values[0])
				})
				res.on('error', (error) => {
					new Erro({
						erro: {
							info: 'Erro na busca de idscbpf ldap',
							error
						}
					}).save()
					return reject('Erro ao baixar usuários')
				})
				res.on('end', () => {
					return resolve(users)
				})
			}
		)
	})
}
