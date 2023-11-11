export default (): Promise<Grupos[]> => {
	return new Promise(async (resolve, reject) => {
		const grups: Grupos[] = []
		ldapClient.search(
			LDAP_GROUPS_DN,
			{
				filter: '(cn=*)',
				scope: 'sub',
				attributes: ['description'],
			},
			(err, res) => {
				if (err) {
					new Erro({
						erro: {
							info: 'erro ao buscar grupos ldap',
							err,
						},
					}).save()
					return reject('Erro ao baixar grupos')
				}
				res.on('searchEntry', (entry) => {
					const dn = entry.dn.toString()
					const dnArr = dn.split(',')
					const subgrupo = dnArr[0].replace('cn=', '')
					const grupo = dnArr[1].replace('ou=', '')
					grups.push({
						subgrupo,
						grupo,
						description: entry.pojo.attributes[0].values[0],
					})
				})
				res.on('error', (error) => {
					new Erro({
						erro: {
							info: 'erro ao buscar grupos ldap',
							error,
						},
					}).save()
					return reject('Erro ao baixar grupos')
				})
				res.on('end', () => {
					grups.sort((a, b) => a.grupo.localeCompare(b.grupo))
					return resolve(grups)
				})
			},
		)
	})
}
