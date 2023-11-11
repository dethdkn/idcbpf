export default (
	responsavel: string,
	uid: string,
	coordenacoes: string[],
	oldCoordenacoes: string[],
): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const adicionados = coordenacoes.filter(x => !oldCoordenacoes.includes(x))
		const removidos = oldCoordenacoes.filter(x => !coordenacoes.includes(x))
		for (const adicionado of adicionados) {
			const change = new LdapChange({
				operation: 'add',
				modification: {
					type: 'member',
					values: [`uid=${uid}, ${LDAP_PEOPLE_DN}`],
				},
			})
			ldapClient.modify(`cn=${adicionado}, ${LDAP_COORDINATIONS_DN}`, change, (err) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro ao adicinar usuario a coordenacao ldap',
							err,
							adicionado,
						},
					}).save()
					return reject('Erro ao adicionar usuário à coordenação')
				}
			})
			new Log({
				usuario: responsavel,
				acao: `Adicionou o usuário '${uid}' à coordenação '${adicionado}'`,
			}).save()
		}
		for (const removido of removidos) {
			const change = new LdapChange({
				operation: 'delete',
				modification: {
					type: 'member',
					values: [`uid=${uid}, ${LDAP_PEOPLE_DN}`],
				},
			})
			ldapClient.modify(`cn=${removido}, ${LDAP_COORDINATIONS_DN}`, change, (err) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro ao remover usuario da coordenacao ldap',
							err,
							removido,
						},
					}).save()
					return reject('Erro ao remover usuário da coordenação')
				}
			})
			new Log({
				usuario: responsavel,
				acao: `Removeu o usuário '${uid}' da coordenação '${removido}'`,
			}).save()
		}
		return resolve()
	})
}
