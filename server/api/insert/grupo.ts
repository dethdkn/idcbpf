export default defineEventHandler(async (event) => {
	const {user} = event.context
	const {subgrupo, grupo, descricao, novo} = JSON.parse(await readBody(event)) as {
		subgrupo: string
		grupo: string
		descricao: string
		novo: boolean
	}
	try {
		if (user && ['Administrador'].includes(user.level)) {
			if (novo) await insertOU(user.idcbpf, grupo)
			await insertCN(user.idcbpf, subgrupo, grupo, descricao)
			return ''
		}
		throw {statusCode: 403, statusMessage: 'Proibido', message: 'Nao autorizado'}
	} catch (e) {
		if (e && typeof e === 'string')
			throw createError({statusCode: 500, message: e, statusMessage: 'Erro no servidor'})
		if (e && typeof e === 'object' && 'statusCode' in e && 'message' in e && 'statusMessage' in e)
			if (
				typeof e.statusCode === 'number' &&
				typeof e.message === 'string' &&
				typeof e.statusMessage === 'string'
			)
				throw createError({
					statusCode: e.statusCode,
					message: e.message,
					statusMessage: e.statusMessage
				})
		throw createError({
			statusCode: 500,
			message: 'Ocorreu um erro desconhecido',
			statusMessage: 'Erro no servidor'
		})
	}
})
