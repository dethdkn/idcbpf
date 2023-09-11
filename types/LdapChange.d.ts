import type {Change} from 'ldapjs'

declare global {
	type LdapChange = Change
}

export {LdapChange}
