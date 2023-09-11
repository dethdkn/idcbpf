declare global {
	interface TokenUsuario {
		idcbpf: string
		authenticated: boolean
		level: 'Administrador' | 'Moderador' | 'Auditor' | ''
	}
}

export {TokenUsuario}
