export default (responsavel: string, cn: string, ou: string, uid: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const change = new LdapChange({
			operation: 'delete',
			modification: {
				type: 'member',
				values: [`uid=${uid}, ${LDAP_PEOPLE_DN}`],
			},
		})
		ldapClient.modify(`cn=${cn}, ou=${ou}, ${LDAP_GROUPS_DN}`, change, (err) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao remover usuario ao grupo ldap',
						err,
						cn,
						ou,
					},
				}).save()
				return reject('Erro ao remover usuário ao grupo')
			}
			new Log({
				usuario: responsavel,
				acao: `Removeu o usuário '${uid}' ao subgrupo '${cn}' do grupo '${ou}'`,
			}).save()
			return resolve()
		})
	})
}
