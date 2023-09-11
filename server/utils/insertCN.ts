export default (responsavel: string, cn: string, ou: string, descricao: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const entrys = {
			objectClass: ['groupOfNames', 'top'],
			cn: cn,
			description: descricao ? descricao : '-',
			member: ''
		}
		ldapClient.add(`cn=${cn}, ou=${ou}, ${LDAP_GROUPS_DN}`, entrys, (err) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao criar cn no ldap',
						err
					}
				}).save()
				return reject('Erro ao criar Subgrupo')
			}
			new Log({
				usuario: responsavel,
				acao: `Criou o subgrupo '${cn}' do grupo '${ou}'`
			}).save()
			return resolve()
		})
	})
}
