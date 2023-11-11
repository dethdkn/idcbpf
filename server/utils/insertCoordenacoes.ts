export default (uid: string, coordenacoes: string[]): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		for (const coordenacao of coordenacoes) {
			const change = new LdapChange({
				operation: 'add',
				modification: {
					type: 'member',
					values: [`uid=${uid}, ${LDAP_PEOPLE_DN}`],
				},
			})
			ldapClient.modify(`cn=${coordenacao}, ${LDAP_COORDINATIONS_DN}`, change, (err) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro ao adicinar usuario a coordenacao ldap',
							err,
						},
					}).save()
					return reject('Erro ao adicionar usuário à coordenação')
				}
			})
		}
		return resolve()
	})
}
