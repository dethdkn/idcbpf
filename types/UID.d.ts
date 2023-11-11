declare global {
	interface UID {
		uid: string
		givenName?: string
		sn?: string
		telephoneNumber?: string
		mobile?: string
		personalMail?: string
		userValidity?: string
		description?: string
		jpegPhoto?: string
		coordenacoes: string[]
		grupos: string[]
	}
}

export { UID }
