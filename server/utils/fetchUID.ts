export default (uid: string): Promise<UID> => {
	return new Promise(async (resolve, reject) => {
		const user: UID = {uid: '', coordenacoes: [], grupos: []}
		ldapClient.search(
			`uid=${uid}, ${LDAP_PEOPLE_DN}`,
			{
				scope: 'sub',
				attributes: [
					'uid',
					'givenName',
					'sn',
					'telephoneNumber',
					'mobile',
					'personalMail',
					'userValidity',
					'description'
				]
			},
			(err, res) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro na busca de informações do usuario no ldap',
							err
						}
					}).save()
					return reject('Erro ao baixar usuário')
				}
				res.on('searchEntry', (entry) => {
					for (const atributo of entry.pojo.attributes) {
						if (atributo.type === 'uid') user.uid = atributo.values[0]
						if (atributo.type === 'givenName') user.givenName = atributo.values[0]
						if (atributo.type === 'sn') user.sn = atributo.values[0]
						if (atributo.type === 'telephoneNumber') user.telephoneNumber = atributo.values[0]
						if (atributo.type === 'mobile') user.mobile = atributo.values[0]
						if (atributo.type === 'personalMail') user.personalMail = atributo.values[0]
						if (atributo.type === 'userValidity') user.userValidity = atributo.values[0]
						if (atributo.type === 'description') user.description = atributo.values[0]
					}
				})
				res.on('error', (error) => {
					new Erro({
						erro: {
							info: 'Erro na busca de informações do usuario no ldap',
							error
						}
					}).save()
					return reject('Erro ao baixar usuário')
				})
				res.on('end', () => {
					return resolve(user)
				})
			}
		)
	})
}
