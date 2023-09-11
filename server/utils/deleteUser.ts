export default (uid: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		ldapClient.del(`uid=${uid}, ${LDAP_PEOPLE_DN}`, (err) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao deletar usuário do ldap',
						err
					}
				}).save()
				return reject('Erro ao deletar usuário')
			}
			return resolve()
		})
	})
}
