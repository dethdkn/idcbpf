export default (
	responsavel: string,
	uid: string,
	grupos: string[],
	oldGrupos: string[]
): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const adicionados = grupos.filter((x) => !oldGrupos.includes(x))
		const removidos = oldGrupos.filter((x) => !grupos.includes(x))
		for (const adicionado of adicionados) {
			const grupoArr = adicionado.split(' - ')
			const subgrupo = grupoArr[0]
			const grupo = grupoArr[1]
			const change = new ldapChange({
				operation: 'add',
				modification: {
					type: 'member',
					values: [`uid=${uid}, ${LDAP_PEOPLE_DN}`]
				}
			})
			ldapClient.modify(`cn=${subgrupo}, ou=${grupo}, ${LDAP_GROUPS_DN}`, change, (err) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro ao adicinar usuario ao grupo ldap',
							err,
							subgrupo,
							grupo
						}
					}).save()
					return reject('Erro ao adicionar usuário ao grupo')
				}
			})
			new Log({
				usuario: responsavel,
				acao: `Adicionou o usuário '${uid}' ao subgrupo '${subgrupo}' do grupo '${grupo}'`
			}).save()
		}
		for (const removido of removidos) {
			const grupoArr = removido.split(' - ')
			const subgrupo = grupoArr[0]
			const grupo = grupoArr[1]
			const change = new ldapChange({
				operation: 'delete',
				modification: {
					type: 'member',
					values: [`uid=${uid}, ${LDAP_PEOPLE_DN}`]
				}
			})
			ldapClient.modify(`cn=${subgrupo}, ou=${grupo}, ${LDAP_GROUPS_DN}`, change, (err) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro ao remover usuario do grupo ldap',
							err,
							subgrupo,
							grupo
						}
					}).save()
					return reject('Erro ao remover usuário do grupo')
				}
			})
			new Log({
				usuario: responsavel,
				acao: `Removeu o usuário '${uid}' do subgrupo '${subgrupo}' do grupo '${grupo}'`
			}).save()
		}
		return resolve()
	})
}
