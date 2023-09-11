export default (cn: string, ou: string): Promise<string[]> => {
	return new Promise((resolve, reject) => {
		let members: string[] = []
		ldapClient.search(
			`cn=${cn}, ou=${ou}, ${LDAP_GROUPS_DN}`,
			{attributes: ['member']},
			(err, res) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro na busca de membros de um grupo ldap',
							cn,
							ou,
							err
						}
					}).save()
					return reject('Erro ao baixar membros dos grupos')
				}
				res.on('searchEntry', (entry) => {
					members = entry.pojo.attributes[0].values
				})
				res.on('error', (error) => {
					new Erro({
						erro: {
							info: 'Erro na busca de membros de um grupo ldap',
							cn,
							ou,
							error
						}
					}).save()
					return reject('Erro ao baixar membros dos grupos')
				})
				res.on('end', () => {
					return resolve(limparMembros(members))
				})
			}
		)
	})
}
