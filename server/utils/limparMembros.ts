export default (stringSuja: string[]): string[] => {
	const membros = stringSuja.map((ss) => {
		return ss.replace('uid=', '').replace(`,${LDAP_PEOPLE_DN.replace(/\s+/g, '')}`, '')
	})
	const indexToRemove = membros.indexOf('')
	if (indexToRemove !== -1)
		membros.splice(indexToRemove, 1)

	return membros
}
