export default defineEventHandler(async (event) => {
	const { idcbpf, passwd } = (await readBody(event)) as {
		idcbpf: string
		passwd: string
	}
	const usuarioAutenticado: TokenUsuario = {
		authenticated: false,
		idcbpf: '',
		level: '',
	}
	try {
		if ((await validIDCBPF(idcbpf)) && passwd) {
			usuarioAutenticado.level = await levelUsuario(idcbpf)
			if (await validarSenhas(passwd, await senhasUser(idcbpf))) {
				usuarioAutenticado.authenticated = true
				usuarioAutenticado.idcbpf = idcbpf
				const token = jwtSign(usuarioAutenticado, JWT, { expiresIn: '8h' })
				return {
					token,
					isLoggedIn: true,
					idcbpf,
					level: usuarioAutenticado.level,
				}
			}
			else {
				throw {
					statusCode: 401,
					statusMessage: 'Nao autorizado',
					message: 'Usuario e/ou Senha inválidos',
				}
			}
		}
		else {
			throw {
				statusCode: 401,
				statusMessage: 'Nao autorizado',
				message: 'Usuario e/ou Senha inválidos',
			}
		}
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
