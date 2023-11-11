<script setup lang="ts">
const { idcbpf } = defineProps({
	idcbpf: {
		type: String,
		required: true,
	},
})

const { idcbpf: loggedIdcbpf, level } = storeToRefs(userStore())

const {
	data: idcbpfOriginal,
	error,
	refresh: refreshIDCBPF,
} = await useFetch('/api/fetch/idcbpf', { method: 'post', body: { idcbpf } })
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}

const coordenacoes = ref<Coordinations[]>([])
const grupos = ref<Grupos[]>([])

if (['Administrador', 'Auditor'].includes(level.value)) {
	const { data: coordData, error: error1 } = await useFetch('/api/fetch/coordenacoes')
	if (error1.value) {
		const err = (error1.value as any).data
		if (err) {
			const { statusCode, statusMessage, message } = err
			throw createError({ statusCode, statusMessage, message })
		}
	}
	if (coordData.value)
		coordenacoes.value = coordData.value

	const { data: grupData, error: error2 } = await useFetch('/api/fetch/grupos')
	if (error2.value) {
		const err = (error2.value as any).data
		if (err) {
			const { statusCode, statusMessage, message } = err
			throw createError({ statusCode, statusMessage, message })
		}
	}
	if (grupData.value)
		grupos.value = grupData.value
}

const modalFoto = ref(false)
function abrirModalFoto() {
	if (modoEdicao.value) {
		if (level.value === 'Administrador' || idcbpf === loggedIdcbpf.value)
			modalFoto.value = true
	}
}

const { open, reset, onChange } = useFileDialog({ accept: 'image/*' })
onChange(async (file) => {
	if (file) {
		foto.value = await useFileToB64(file[0])
		reset()
		modalFoto.value = false
	}
})

const loadingWebcam = ref(false)
const webcamDiv = ref<HTMLVideoElement | null>(null)
const webcamStream = ref<MediaStream | null>(null)
function iniciarCamera() {
	loadingWebcam.value = true
	if (process.client) {
		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ audio: false, video: { facingMode: 'user' } })
				.then((stream) => {
					loadingWebcam.value = false
					webcamStream.value = stream
					if (webcamDiv.value)
						webcamDiv.value.srcObject = stream
				})
				.catch(() => {})
		}
	}
}
const fotoTirada = ref(false)
const imgFotoTirada = ref<HTMLImageElement | null>(null)
function recFoto() {
	if (webcamDiv.value) {
		const img = useHTMLVideoToImgSrc(webcamDiv.value)
		if (img && imgFotoTirada.value) {
			imgFotoTirada.value.src = img
			fotoTirada.value = true
		}
	}
}
async function escolherFotoTirada() {
	if (imgFotoTirada.value && imgFotoTirada.value.src) {
		foto.value = await useImageSrcToB64(imgFotoTirada.value.src)
		fotoTirada.value = false
		modalFoto.value = false
	}
}
watch(modalFoto, (nv) => {
	if (!nv) {
		if (webcamStream.value) {
			webcamStream.value.getTracks().forEach(track => track.stop())
			webcamStream.value = null
		}
	}
})

const modoEdicao = ref(false)
const foto = ref('')
const nome = ref('')
const sobrenome = ref('')
const ramal = ref('')
const telefone = ref('')
const email = ref('')
const senha = ref('')
const repetirSenha = ref('')
const validade = ref<Date | undefined>()
const descricao = ref('')
const coordenacoesSelecionadas = ref<string[]>([])
const gruposSelecionados = ref<string[]>([])
const loadingEditar = ref(false)

function atribuirOriginais() {
	if (idcbpfOriginal.value) {
		foto.value = idcbpfOriginal.value.jpegPhoto ? idcbpfOriginal.value.jpegPhoto : ''
		nome.value = idcbpfOriginal.value.givenName ? idcbpfOriginal.value.givenName : ''
		sobrenome.value = idcbpfOriginal.value.sn ? idcbpfOriginal.value.sn : ''
		ramal.value = idcbpfOriginal.value.telephoneNumber ? idcbpfOriginal.value.telephoneNumber : ''
		telefone.value = idcbpfOriginal.value.mobile ? idcbpfOriginal.value.mobile : ''
		email.value = idcbpfOriginal.value.personalMail ? idcbpfOriginal.value.personalMail : ''
		senha.value = ''
		repetirSenha.value = ''
		descricao.value = idcbpfOriginal.value.description ? idcbpfOriginal.value.description : ''
		if (idcbpfOriginal.value.userValidity) {
			const partesData = idcbpfOriginal.value.userValidity.split('-')
			validade.value = new Date(Number(partesData[0]), Number(partesData[1]), Number(partesData[2]))
		}
		coordenacoesSelecionadas.value = idcbpfOriginal.value.coordenacoes
		gruposSelecionados.value = idcbpfOriginal.value.grupos
	}
}
atribuirOriginais()

watch(modoEdicao, async (nv) => {
	if (!nv) {
		await refreshIDCBPF()
		atribuirOriginais()
	}
})

async function editar() {
	loadingEditar.value = true
	if (!nome.value) {
		useToast().add({
			title: 'Preencha o Nome',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		return (loadingEditar.value = false)
	}
	if (!sobrenome.value) {
		useToast().add({
			title: 'Preencha o Sobrenome',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		return (loadingEditar.value = false)
	}
	if (!telefone.value) {
		useToast().add({
			title: 'Preencha o Telefone',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		return (loadingEditar.value = false)
	}
	if (!email.value) {
		useToast().add({
			title: 'Preencha o Email Pessoal',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		return (loadingEditar.value = false)
	}
	if (!useValidateEmail(email.value)) {
		useToast().add({
			title: 'Preencha um Email Pessoal Válido',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		return (loadingEditar.value = false)
	}
	if (useIsCBPFMail(email.value)) {
		useToast().add({
			title: 'Email do CBPF não pode ser cadastrado como Email Pessoal',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		return (loadingEditar.value = false)
	}
	if (senha.value) {
		if (!repetirSenha.value) {
			useToast().add({
				title: 'Preencha a Validação de Senha(repetir)',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red',
			})
			return (loadingEditar.value = false)
		}
		if (!useValidatePasswd(senha.value)) {
			useToast().add({
				title:
					'Senha deve conter mínimo de 8 dígitos, 1 letra maiúsculas, 1 letra minúsculas, 1 número e 1 símbolo',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red',
			})
			return (loadingEditar.value = false)
		}
		if (senha.value !== repetirSenha.value) {
			useToast().add({
				title: 'Senhas não coincidem',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red',
			})
			return (loadingEditar.value = false)
		}
	}
	const res = await $fetch('/api/update/usuario', {
		method: 'POST',
		body: {
			idcbpf,
			foto: foto.value,
			nome: nome.value,
			sobrenome: sobrenome.value,
			ramal: ramal.value,
			telefone: telefone.value,
			email: email.value,
			senha: senha.value,
			validade: validade.value,
			descricao: descricao.value,
			coordenacoes: coordenacoesSelecionadas.value,
			grupos: gruposSelecionados.value,
		},
	}).catch(async (err) => {
		modoEdicao.value = false
		await refreshIDCBPF()
		atribuirOriginais()
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		loadingEditar.value = false
	})
	if (res) {
		modoEdicao.value = false
		await refreshIDCBPF()
		atribuirOriginais()
		useToast().add({
			title: 'Usuário editado com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
		return loadingEditar.value = false
	}
}

const itemsGrupos = computed(() => {
	const items: { grupo: string; subgrupo: string; descricao?: string; label: string }[] = []
	if (grupos.value) {
		for (const grupo of grupos.value) {
			items.push({
				grupo: grupo.grupo,
				subgrupo: grupo.subgrupo,
				descricao: grupo.description,
				label: grupo.grupo,
			})
		}
	}
	const groupedItems = items.reduce<
		{ grupo: string; subgrupo: { nome: string; descricao?: string }[]; label: string }[]
	>((acc, obj) => {
		const existingGroup = acc.find(item => item.grupo === obj.grupo)
		if (existingGroup) {
			existingGroup.subgrupo.push({ nome: obj.subgrupo, descricao: obj.descricao })
		}
		else {
			acc.push({
				grupo: obj.grupo,
				subgrupo: [{ nome: obj.subgrupo, descricao: obj.descricao }],
				label: obj.grupo,
			})
		}
		return acc
	},
	[],
	)
	return groupedItems
})
</script>

<template>
	<UCard
		class="w-full min-h-[calc(100vh-131px)]"
		:ui="{
			base: '',
			ring: '',
			divide: 'divide-y divide-gray-200 dark:divide-gray-700',
			header: { padding: 'px-4' },
			rounded: '',
			body: { padding: 'py-5' },
		}"
	>
		<template #header>
			<h2 class="text-center">
				{{ idcbpf }}
			</h2>
			<div class="flex justify-center mt-2">
				<div
					class="relative flex cursor-pointer"
					:class="{
						'cursor-pointer': (level === 'Administrador' || idcbpf === loggedIdcbpf) && modoEdicao,
						'group': (level === 'Administrador' || idcbpf === loggedIdcbpf) && modoEdicao,
						'!cursor-default': !modoEdicao,
					}"
					@click="abrirModalFoto"
				>
					<img
						v-if="foto.length > 0"
						class="w-24 h-24 rounded-full"
						:src="`data:image/jpeg;base64,${foto}`"
						alt="Usuário sem foto"
					>
					<img
						v-else
						class="w-24 h-24 rounded-full"
						src="~/assets/images/nopic.jpg"
						alt="Usuário sem foto"
					>
					<div
						class="absolute flex items-center justify-center invisible w-24 h-24 rounded-full bg-slate-950 opacity-70 group-hover:visible"
					>
						<UIcon name="i-heroicons-camera" class="text-xl text-white" />
					</div>
				</div>
			</div>
		</template>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 place-items-center">
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="uid-form">ID CBPF</label>
				<UInput id="uid-form" icon="i-heroicons-user" :value="idcbpf" disabled />
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="nome-form">Nome</label>
				<UInput
					id="nome-form"
					v-model="nome"
					icon="i-heroicons-identification"
					:disabled="level === 'Auditor' || !modoEdicao"
					@keydown.space.prevent
				/>
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="sobrenome-form"
				>Sobrenome</label>
				<UInput
					id="sobrenome-form"
					v-model="sobrenome"
					icon="i-heroicons-credit-card"
					:disabled="level === 'Auditor' || !modoEdicao"
				/>
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="ramal-form">Ramal</label>
				<UInput
					id="ramal-form"
					v-model="ramal"
					icon="i-heroicons-phone"
					:disabled="level === 'Auditor' || !modoEdicao"
					@keydown="useIsNumber"
				/>
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="telefone-form"
				>Telefone</label>
				<UInput
					id="telefone-form"
					v-model="telefone"
					icon="i-heroicons-device-phone-mobile"
					:disabled="level === 'Auditor' || !modoEdicao"
					@keydown="useIsNumber"
				/>
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="email-form">Email Pessoal</label>
				<UInput
					id="email-form"
					v-model="email"
					icon="i-heroicons-envelope"
					:disabled="level === 'Auditor' || !modoEdicao"
				/>
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="senha-form">Senha</label>
				<UInput
					id="senha-form"
					v-model="senha"
					icon="i-heroicons-key"
					type="password"
					:disabled="level === 'Auditor' || !modoEdicao"
				/>
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="repetir-senha-form"
				>Repetir Senha</label>
				<UInput
					id="repetir-senha-form"
					v-model="repetirSenha"
					icon="i-heroicons-shield-exclamation"
					type="password"
					:disabled="level === 'Auditor' || !modoEdicao"
				/>
			</div>
			<div v-if="['Administrador', 'Auditor'].includes(level)" class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="validade-form"
				>Validade</label>
				<VDatePicker
					id="validade-form"
					v-model="validade"
					:disabled="level === 'Auditor' || !modoEdicao"
				/>
			</div>
			<div
				v-if="['Administrador', 'Auditor'].includes(level)"
				class="w-full col-span-1 sm:col-span-2 md:col-span-3"
			>
				<label
					class="block mb-2 text-sm font-medium text-gray-900 ms-1 dark:text-white"
					for="descricao-form"
				>Descrição</label>
				<UTextarea
					id="descricao-form"
					v-model="descricao"
					autoresize
					:disabled="level === 'Auditor' || !modoEdicao"
				/>
			</div>
			<div
				v-if="['Administrador', 'Auditor'].includes(level)"
				class="w-full col-span-1 p-5 border border-gray-700 sm:col-span-2 md:col-span-3"
			>
				<h4 class="mb-4 text-center">
					Coordenações
				</h4>
				<div v-if="coordenacoes" class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-6 place-items-center">
					<div
						v-for="coordenacao in coordenacoes"
						:key="coordenacao.cn"
						class="w-full text-center sm:text-start sm:ms-24"
					>
						<UTooltip :text="coordenacao.description" :popper="{ placement: 'top' }">
							<UCheckbox
								v-model="coordenacoesSelecionadas"
								:label="coordenacao.cn"
								:value="coordenacao.cn"
								:disabled="level === 'Auditor' || !modoEdicao"
							/>
						</UTooltip>
					</div>
				</div>
			</div>
			<div
				v-if="['Administrador', 'Auditor'].includes(level)"
				class="w-full col-span-1 p-5 border border-gray-700 sm:col-span-2 md:col-span-3"
			>
				<h4 class="mb-4 text-center">
					Grupos
				</h4>
				<ClientOnly>
					<template #fallback>
						<div class="flex items-center justify-center">
							<UButton loading label="Carregando" />
						</div>
					</template>
					<div class="grid grid-cols-3 gap-4 place-items-center">
						<UAccordion
							v-for="grupo in itemsGrupos"
							:key="`${grupo.subgrupo} - ${grupo.grupo}`"
							:ui="{ wrapper: 'flex flex-col w-full' }"
							:items="[grupo]"
						>
							<template #default="{ item, open: isOpen }">
								<UButton
									color="gray"
									variant="ghost"
									class="border-b border-gray-200 dark:border-gray-700"
									:ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
								>
									<template #leading>
										<div
											class="flex items-center justify-center w-6 h-6 -my-1 rounded-full bg-primary-500 dark:bg-primary-400"
										>
											<UIcon
												name="i-heroicons-user-group"
												class="w-4 h-4 text-white dark:text-gray-900"
											/>
										</div>
									</template>
									<span class="truncate">{{ item.label }}</span>
									<template #trailing>
										<UIcon
											name="i-heroicons-chevron-right-20-solid"
											class="w-5 h-5 transition-transform duration-200 transform ms-auto"
											:class="[isOpen && 'rotate-90']"
										/>
									</template>
								</UButton>
							</template>
							<template #item="{ item }">
								<div class="italic text-center text-gray-900 dark:text-white">
									<div v-for="sub in item.subgrupo" :key="sub" class="flex items-start justify-start space-y-3">
										<UTooltip
											:key="`${sub.nome} - ${item.grupo}`"
											:text="sub.descricao"
											:popper="{ placement: 'top' }"
										>
											<UCheckbox
												v-model="gruposSelecionados"
												:label="`${sub.nome} - ${item.grupo}`"
												:value="`${sub.nome} - ${item.grupo}`"
												:disabled="level === 'Auditor' || !modoEdicao"
											/>
										</UTooltip>
									</div>
								</div>
							</template>
						</UAccordion>
					</div>
				</ClientOnly>
			</div>
		</div>
		<template #footer>
			<div class="flex justify-center space-x-2">
				<UButton
					v-if="(level === 'Administrador' || idcbpf === loggedIdcbpf) && !modoEdicao"
					icon="i-heroicons-pencil"
					label="Habilitar Edição"
					@click="modoEdicao = true"
				/>
				<UButton
					v-if="(level === 'Administrador' || idcbpf === loggedIdcbpf) && modoEdicao"
					icon="i-heroicons-x-circle"
					label="Cancelar"
					color="red"
					:disabled="loadingEditar"
					@click="modoEdicao = false"
				/>
				<UButton
					v-if="(level === 'Administrador' || idcbpf === loggedIdcbpf) && modoEdicao"
					icon="i-heroicons-pencil-square"
					label="Editar"
					color="green"
					:loading="loadingEditar"
					@click="editar"
				/>
			</div>
		</template>
	</UCard>

	<UModal v-model="modalFoto" :ui="{ width: '!w-3/5 sm:max-w-full' }">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-cyan-500' },
			}"
		>
			<template #header>
				<h3 class="text-center">
					Foto de Perfil
				</h3>
			</template>
			<span>
				Uma foto institucional ideal deve ser tirada acima dos ombros, sem o uso de acessórios, como
				chapéus. Isso garante um enquadramento focado na expressão facial, transmitindo uma imagem
				profissional e confiável. Evitar acessórios ajuda a manter a clareza e a atenção direcionada
				ao rosto.
			</span>
			<USkeleton v-if="loadingWebcam" class="m-auto mt-4 h-96 w-96" />
			<div v-show="webcamStream" class="relative flex justify-center m-4">
				<video v-show="!fotoTirada" ref="webcamDiv" autoplay="true" />
				<img v-show="fotoTirada" ref="imgFotoTirada" src="">
				<UButton
					v-if="!fotoTirada"
					class="absolute bottom-[-15px]"
					icon="i-heroicons-camera"
					color="green"
					:ui="{ rounded: 'rounded-full' }"
					@click="recFoto"
				/>
				<UButton
					v-else
					class="absolute bottom-[-15px]"
					icon="i-heroicons-arrow-uturn-left"
					color="red"
					:ui="{ rounded: 'rounded-full' }"
					@click="fotoTirada = false"
				/>
			</div>

			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton label="Enviar Arquivo" color="blue" icon="i-heroicons-photo" @click="open" />
					<UButton
						v-if="!webcamStream"
						label="Abrir Câmera"
						color="green"
						icon="i-heroicons-camera"
						:disabled="loadingWebcam"
						@click="iniciarCamera"
					/>
					<UButton
						v-else
						label="Enviar esta Foto"
						color="green"
						icon="i-heroicons-camera"
						:disabled="!fotoTirada"
						@click="escolherFotoTirada"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
