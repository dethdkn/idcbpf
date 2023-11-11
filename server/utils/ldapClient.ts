export const ldapClient = ldapjs.createClient({
	url: LDAP_URL,
	reconnect: { initialDelay: 100, maxDelay: 500, failAfter: Number.POSITIVE_INFINITY },
})
ldapClient.bind(LDAP_DN, LDAP_PASSWORD, () => {})

ldapClient.on('resultError', () => {
	ldapClient.bind(LDAP_DN, LDAP_PASSWORD, () => {})
})
