export default (responsavel: string, cn: string, ou: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		ldapClient.del(`cn=${cn}, ou=${ou}, ${LDAP_GROUPS_DN}`, (err) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao deletar subgrupo do ldap',
						err,
					},
				}).save()
				return reject('Erro ao deletar subgrupo')
			}
			new Log({
				usuario: responsavel,
				acao: `Excluiu o subgrupo '${cn}' do grupo topo '${ou}'`,
			}).save()
			return resolve()
		})
	})
}
