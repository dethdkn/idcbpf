mongoose.connect(MONGO_URL, {
	tls: false,
	authMechanism: 'SCRAM-SHA-1',
	auth: {
		username: MONGO_USERNAME,
		password: MONGO_PASSWORD
	},
	dbName: MONGO_DB_NAME
})

export const Erro = mongoose.model(
	'erro',
	new Schema({
		erro: {type: Object, required: true},
		data: {type: Date, default: new Date()}
	})
)

export const Log = mongoose.model(
	'log',
	new Schema<Logs>({
		usuario: {type: String, required: true},
		acao: {type: String, required: true},
		data: {type: Date, default: new Date()}
	})
)
