import { Buffer } from 'node:buffer'

export default (textPasswd: string, SSHAPasswd: string): string => {
	const salt = Buffer.from(SSHAPasswd.slice(6), 'base64').slice(20)
	const hashedPassword = createHash('sha1').update(textPasswd).update(salt)
	return `{SSHA}${Buffer.concat([hashedPassword.digest(), salt]).toString('base64')}`
}
