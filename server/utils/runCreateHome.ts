export default (uid: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		exec(`${CREATE_HOME_SH} ${uid}'`, (error, stdout, stderr) => {
			if (error) {
				new Erro({
					erro: {
						info: 'Erro ao criar home do usuario',
						error,
						stdout,
						stderr
					}
				}).save()
				return reject('Erro ao criar home do usuário')
			}
			return resolve()
		})
	})
}
