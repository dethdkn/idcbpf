export default defineEventHandler(async (event) => {
	const {user} = event.context
	const {idcbpf} = (await readBody(event)) as {
		idcbpf: string
	}
	try {
		if (user && (['Administrador', 'Auditor'].includes(user.level) || user.idcbpf === idcbpf)) {
			if (await validIDCBPF(idcbpf)) {
				const uid = await fetchUID(idcbpf)
				const fotoPerfil = await fotoUser(idcbpf)
				if (fotoPerfil) uid.jpegPhoto = fotoPerfil
				uid.coordenacoes = await coordenacoesArray(idcbpf)
				uid.grupos = await gruposArray(idcbpf)
				return uid
			}
			throw {statusCode: 404, statusMessage: 'Não Existe', message: 'Este usuário não existe'}
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
