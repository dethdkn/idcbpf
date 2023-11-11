export default (uid: string): Promise<string[]> => {
	return new Promise((resolve, reject) => {
		let passwords: string[] = []
		ldapClient.search(
			`uid=${uid}, ${LDAP_PEOPLE_DN}`,
			{ attributes: ['userPassword'] },
			(err, res) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro ao buscar senhas do usuario no Ldap',
							uid,
							err,
						},
					}).save()
					return reject('Erro ao baixar senhas do usuário')
				}
				res.on('searchEntry', (entry) => {
					passwords = entry.pojo.attributes[0].values
				})
				res.on('error', (error) => {
					new Erro({
						erro: {
							info: 'Erro ao buscar senhas do usuario no Ldap',
							uid,
							error,
						},
					}).save()
					return reject('Erro ao baixar senhas do usuário')
				})
				res.on('end', () => {
					return resolve(passwords)
				})
			},
		)
	})
}
