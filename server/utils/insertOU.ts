export default (responsavel: string, ou: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const entrys = {
			objectClass: ['top', 'organizationalUnit'],
			ou,
		}
		ldapClient.add(`ou=${ou}, ${LDAP_GROUPS_DN}`, entrys, (err) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao criar ou no ldap',
						err,
					},
				}).save()
				return reject('Erro ao criar Grupo Topo')
			}
			new Log({
				usuario: responsavel,
				acao: `Criou o grupo topo '${ou}'`,
			}).save()
			return resolve()
		})
	})
}
