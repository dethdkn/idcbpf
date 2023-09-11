export default (foto: File): Promise<string> => {
	return new Promise((resolve) => {
		if (foto.type.startsWith('image/')) {
			const reader = new FileReader()
			reader.onload = (e) => {
				const image = new Image()
				image.src = e.target?.result as string
				image.onload = () => {
					const canvas = document.createElement('canvas')
					const ctx = canvas.getContext('2d')
					if (ctx) {
						const {width, height} = image
						let sx, sy
						if (width > height) {
							sx = Math.round((width - height) / 2)
							sy = 0
						} else {
							sx = 0
							sy = Math.round((height - width) / 2)
						}
						canvas.width = 128
						canvas.height = 128
						ctx.clearRect(0, 0, canvas.width, canvas.height)
						ctx.drawImage(
							image,
							sx,
							sy,
							Math.min(width, height),
							Math.min(width, height),
							0,
							0,
							128,
							128
						)
						return resolve(canvas.toDataURL('image/jpeg').replace('data:image/jpeg;base64,', ''))
					}
				}
			}
			reader.readAsDataURL(foto)
		} else {
			return resolve('')
		}
	})
}
