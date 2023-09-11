export default (senha: string) => {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+[\]{}|\\,./<>?]).{8,}$/.test(senha)
}
