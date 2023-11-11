export default (): Promise<Coordinations[]> => {
	return new Promise(async (resolve, reject) => {
		const coord: Coordinations[] = []
		ldapClient.search(
			LDAP_COORDINATIONS_DN,
			{
				filter: '(cn=*)',
				scope: 'sub',
				attributes: ['cn', 'description'],
			},
			(err, res) => {
				if (err) {
					new Erro({
						erro: {
							info: 'erro ao buscar coordenações ldap',
							err,
						},
					}).save()
					return reject('Erro ao baixar coordenações')
				}
				res.on('searchEntry', (entry) => {
					const atributos: {
						cn: string
						description?: string
					} = { cn: '' }
					for (const atributo of entry.pojo.attributes) {
						if (atributo.type === 'cn')
							atributos.cn = atributo.values[0]
						if (atributo.type === 'description')
							atributos.description = atributo.values[0]
					}
					if (atributos.cn.length > 0)
						coord.push(atributos)
				})
				res.on('error', (error) => {
					new Erro({
						erro: {
							info: 'erro ao buscar coordenações ldap',
							error,
						},
					}).save()
					return reject('Erro ao baixar coordenações')
				})
				res.on('end', () => {
					return resolve(coord)
				})
			},
		)
	})
}
