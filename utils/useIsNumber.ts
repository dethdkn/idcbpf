export default (e: KeyboardEvent) => {
	if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab')
		return e.preventDefault()
}
