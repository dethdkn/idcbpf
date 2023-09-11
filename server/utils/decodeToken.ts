export default (tokenCrypt: string): Promise<TokenUsuario | null> => {
	return new Promise((resolve) => {
		jwtVerify(tokenCrypt, JWT, (err, decoded) => {
			if (!err && decoded) return resolve(decoded as TokenUsuario)
			return resolve(null)
		})
	})
}
