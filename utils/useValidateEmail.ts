export default (email: string): boolean => {
	if (/^\S+@\S+\.\S+$/.test(email))
		return true
	return false
}
