export default (responsavel: string, cn: string, ou: string, descricao: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const change = new ldapChange({
			operation: 'replace',
			modification: {
				type: 'description',
				values: [descricao]
			}
		})
		ldapClient.modify(`cn=${cn}, ou=${ou}, ${LDAP_GROUPS_DN}`, change, (err) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao editar descricao do subgrupo ldap',
						err,
						ou,
						cn,
						descricao
					}
				}).save()
				return reject('Erro ao editar descrição do subgrupo')
			}
			new Log({
				usuario: responsavel,
				acao: `Editou a descrição do subgrupo '${cn}' do grupo topo '${ou}'`
			}).save()
			return resolve()
		})
	})
}
