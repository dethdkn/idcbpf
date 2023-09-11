export default (selecionada: Date) => {
	const hoje = new Date()
	hoje.setHours(0, 0, 0, 0)
	selecionada.setHours(0, 0, 0, 0)
	if (selecionada < hoje) return true
	return false
}
