export default (video: HTMLVideoElement): string | null => {
	const canvas = document.createElement('canvas')
	canvas.width = video.videoWidth
	canvas.height = video.videoHeight
	const ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.drawImage(video, 0, 0)
		return canvas.toDataURL('image/jpeg')
	}
	return null
}
