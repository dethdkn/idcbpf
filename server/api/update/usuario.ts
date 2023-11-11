export default defineEventHandler(async (event) => {
	const { user } = event.context
	const {
		idcbpf,
		foto,
		nome,
		sobrenome,
		ramal,
		telefone,
		email,
		senha,
		validade,
		descricao,
		coordenacoes,
		grupos,
	} = await readBody(event) as {
		idcbpf: string
		foto: string
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
		if (user && (['Administrador'].includes(user.level) || user.idcbpf === idcbpf)) {
			if (await validIDCBPF(idcbpf)) {
				const oldUid = await fetchUID(idcbpf)
				oldUid.jpegPhoto = await fotoUser(idcbpf)
				oldUid.coordenacoes = await coordenacoesArray(idcbpf)
				oldUid.grupos = await gruposArray(idcbpf)
				await updateUser(
					user.idcbpf,
					oldUid,
					idcbpf,
					foto,
					nome,
					sobrenome,
					telefone,
					email,
					senha,
					ramal,
					validade,
					descricao,
				)
				if (user && ['Administrador'].includes(user.level)) {
					await updateCoordenacoes(user.idcbpf, idcbpf, coordenacoes, oldUid.coordenacoes)
					await updateGrupos(user.idcbpf, idcbpf, grupos, oldUid.grupos)
				}
				return 'Ok'
			}
			throw { statusCode: 404, statusMessage: 'Não Existe', message: 'Este usuário não existe' }
		}
		throw { statusCode: 403, statusMessage: 'Proibido', message: 'Nao autorizado' }
	}
	catch (e) {
		if (e && typeof e === 'string')
			throw createError({ statusCode: 500, message: e, statusMessage: 'Erro no servidor' })
		if (e && typeof e === 'object' && 'statusCode' in e && 'message' in e && 'statusMessage' in e) {
			if (
				typeof e.statusCode === 'number'
				&& typeof e.message === 'string'
				&& typeof e.statusMessage === 'string'
			) {
				throw createError({
					statusCode: e.statusCode,
					message: e.message,
					statusMessage: e.statusMessage,
				})
			}
		}
		throw createError({
			statusCode: 500,
			message: 'Ocorreu um erro desconhecido',
			statusMessage: 'Erro no servidor',
		})
	}
})
