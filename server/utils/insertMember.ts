export default (responsavel: string, cn: string, ou: string, uid: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const change = new ldapChange({
			operation: 'add',
			modification: {
				type: 'member',
				values: [`uid=${uid}, ${LDAP_PEOPLE_DN}`]
			}
		})
		ldapClient.modify(`cn=${cn}, ou=${ou}, ${LDAP_GROUPS_DN}`, change, (err) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao adicinar usuario ao grupo ldap',
						err,
						cn,
						ou
					}
				}).save()
				return reject('Erro ao adicionar usuário ao grupo')
			}
			new Log({
				usuario: responsavel,
				acao: `Adicionou o usuário '${uid}' ao subgrupo '${cn}' do grupo '${ou}'`
			}).save()
			return resolve()
		})
	})
}
