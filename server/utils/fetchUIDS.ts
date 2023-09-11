export default (): Promise<UIDS[]> => {
	return new Promise(async (resolve, reject) => {
		const users: UIDS[] = []
		ldapClient.search(
			LDAP_PEOPLE_DN,
			{
				filter: '(uid=*)',
				scope: 'sub',
				attributes: ['uid', 'cn', 'lastModifiedBy', 'timeStamp', 'userValidity', 'description']
			},
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
					const atributos = {
						uid: '',
						cn: '',
						lastModifiedBy: '',
						timeStamp: '',
						userValidity: '',
						description: ''
					}
					for (const atributo of entry.pojo.attributes) {
						if (atributo.type === 'uid') atributos.uid = atributo.values[0]
						if (atributo.type === 'cn') atributos.cn = atributo.values[0]
						if (atributo.type === 'lastModifiedBy') atributos.lastModifiedBy = atributo.values[0]
						if (atributo.type === 'timeStamp') atributos.timeStamp = atributo.values[0]
						if (atributo.type === 'userValidity') atributos.userValidity = atributo.values[0]
						if (atributo.type === 'description') atributos.description = atributo.values[0]
					}
					if (atributos.uid.length > 0) users.push(atributos)
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
