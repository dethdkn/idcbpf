export default (): Promise<Logs[]> => {
	return new Promise(async (resolve, reject) => {
		const logs = await Log.find()
			.sort({ data: -1 })
			.catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel ler os logs do banco de dados',
						err,
					},
				}).save()
				return reject('Erro ao baixar logs')
			})
		if (logs)
			return resolve(logs)
		return reject('Erro ao baixar logs')
	})
}
