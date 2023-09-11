export const ldapClient = ldapjs.createClient({
	url: LDAP_URL,
	reconnect: {initialDelay: 100, maxDelay: 500, failAfter: Infinity}
})
ldapClient.bind(LDAP_DN, LDAP_PASSWORD, () => {})

ldapClient.on('error', (err) => {
	new Erro({
		erro: {
			info: 'Erro geral do Ldap',
			err
		}
	}).save()
})

ldapClient.on('resultError', (err) => {
	new Erro({
		erro: {
			info: 'Erro de pesquisa Ldap',
			err
		}
	}).save()
	ldapClient.bind(LDAP_DN, LDAP_PASSWORD, () => {})
})

ldapClient.on('connectRefused', (err) => {
	new Erro({
		erro: {
			info: 'Erro de conexão recusada Ldap',
			err
		}
	}).save()
})

ldapClient.on('connectTimeout', (err) => {
	new Erro({
		erro: {
			info: 'Erro de Timeout na conexão Ldap',
			err
		}
	}).save()
})

ldapClient.on('setupError', (err) => {
	new Erro({
		erro: {
			info: 'Erro de configuração Ldap apos a conexão',
			err
		}
	}).save()
})

ldapClient.on('connectError', (err) => {
	new Erro({
		erro: {
			info: 'Erro de conexão com o socket Ldap',
			err
		}
	}).save()
})

ldapClient.on('socketTimeout', (err) => {
	new Erro({
		erro: {
			info: 'Erro de Timeout no Socket Ldap',
			err
		}
	}).save()
})

ldapClient.on('timeout', (err) => {
	new Erro({
		erro: {
			info: 'Erro de Timeout na pesquisa Ldap',
			err
		}
	}).save()
})

ldapClient.on('destroy', (err) => {
	new Erro({
		erro: {
			info: 'Desconectado do Ldap',
			err
		}
	}).save()
})

ldapClient.on('destroy', (err) => {
	new Erro({
		erro: {
			info: 'Desconectado do Ldap',
			err
		}
	}).save()
})
