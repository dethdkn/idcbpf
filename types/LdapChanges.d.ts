import type { Change } from 'ldapjs'

declare global {
	type LdapChanges = Change
}

export { LdapChanges }
