export default (uid: string, grupos: string[]): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		for (const grupoDashed of grupos) {
			const grupoArr = grupoDashed.split(' - ')
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
							err
						}
					}).save()
					return reject('Erro ao adicionar usuário ao grupo')
				}
			})
		}
		return resolve()
	})
}
