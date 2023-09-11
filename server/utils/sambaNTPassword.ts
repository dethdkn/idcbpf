export default (senha: string): string => {
	const utf16lePassword = Buffer.from(senha, 'utf16le')
	const md4Hash = createHash('md4').update(utf16lePassword).digest()
	return md4Hash.toString('hex').toUpperCase()
}
