export default defineEventHandler(async (event) => {
	const {user} = event.context
	const {
		foto,
		uid,
		nome,
		sobrenome,
		ramal,
		telefone,
		email,
		senha,
		validade,
		descricao,
		coordenacoes,
		grupos
	} = JSON.parse(await readBody(event)) as {
		foto: string
		uid: string
		nome: string
		sobrenome: string
		ramal: string
		telefone: string
		email: string
		senha: string
		validade: string
		descricao: string
		coordenacoes: string[]
		grupos: string[]
	}
	try {
		if (user && ['Administrador'].includes(user.level)) {
			if (await validIDCBPF(uid))
				throw {statusCode: 403, statusMessage: 'Proibido', message: 'Usuário já existe'}
			await insertUser(
				user.idcbpf,
				foto,
				uid,
				nome,
				sobrenome,
				telefone,
				email,
				senha,
				ramal,
				validade,
				descricao
			)
			await insertCoordenacoes(uid, coordenacoes)
			await insertGrupos(uid, grupos)
			await runCreateHome(uid)
			new Log({
				usuario: user.idcbpf,
				acao: `Criou o usuário '${uid}'`
			}).save()
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
