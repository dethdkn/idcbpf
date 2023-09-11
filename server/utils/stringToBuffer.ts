export default (b64: string): Buffer => {
	return Buffer.from(b64, 'base64')
}
