<script setup lang="ts">
const {data: coordenacoes, error: error1} = await useFetch('/api/fetch/coordenacoes')
if (error1.value) {
	const err = (error1.value as any).data
	if (err) {
		const {statusCode, statusMessage, message} = err
		throw createError({statusCode, statusMessage, message})
	}
}
const {data: grupos, error: error2} = await useFetch('/api/fetch/grupos')
if (error2.value) {
	const err = (error2.value as any).data
	if (err) {
		const {statusCode, statusMessage, message} = err
		throw createError({statusCode, statusMessage, message})
	}
}

const {level} = storeToRefs(userStore())

const modalFoto = ref(false)
const abrirModalFoto = () => {
	if (level.value === 'Administrador') modalFoto.value = true
}

const {open, reset, onChange} = useFileDialog({accept: 'image/*'})
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
const iniciarCamera = () => {
	loadingWebcam.value = true
	if (process.client) {
		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({audio: false, video: {facingMode: 'user'}})
				.then((stream) => {
					loadingWebcam.value = false
					webcamStream.value = stream
					if (webcamDiv.value) {
						webcamDiv.value.srcObject = stream
					}
				})
				.catch(() => {})
		}
	}
}
const fotoTirada = ref(false)
const imgFotoTirada = ref<HTMLImageElement | null>(null)
const recFoto = () => {
	if (webcamDiv.value) {
		const img = useHTMLVideoToImgSrc(webcamDiv.value)
		if (img && imgFotoTirada.value) {
			imgFotoTirada.value.src = img
			fotoTirada.value = true
		}
	}
}
const escolherFotoTirada = async () => {
	if (imgFotoTirada.value && imgFotoTirada.value.src) {
		foto.value = await useImageSrcToB64(imgFotoTirada.value.src)
		fotoTirada.value = false
		modalFoto.value = false
	}
}
watch(modalFoto, (nv) => {
	if (!nv)
		if (webcamStream.value) {
			webcamStream.value.getTracks().forEach((track) => track.stop())
			webcamStream.value = null
		}
})

const foto = ref('')
const uid = ref('')
const nome = ref('')
const sobrenome = ref('')
const ramal = ref('')
const telefone = ref('')
const email = ref('')
const senha = ref('')
const repetirSenha = ref('')
const validade = ref<Date | undefined>()
const descricao = ref('')
const coordenacoesSelecionadas = ref([])
const gruposSelecionados = ref([
	'membros - antispam',
	'membros - cafe',
	'membros - eduroam',
	'membros - email',
	'membros - indico',
	'membros - os',
	'membros - positron',
	'membros - rdp',
	'membros - sendmail',
	'membros - validacao-digital'
])
const loadingCriar = ref(false)

const criar = () => {
	loadingCriar.value = true
	if (!uid.value) {
		useToast().add({
			title: 'Preencha o ID CBPF',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	if (!nome.value) {
		useToast().add({
			title: 'Preencha o Nome',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	if (!sobrenome.value) {
		useToast().add({
			title: 'Preencha o Sobrenome',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	if (!telefone.value) {
		useToast().add({
			title: 'Preencha o Telefone',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	if (!email.value) {
		useToast().add({
			title: 'Preencha o Email Pessoal',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	if (!senha.value) {
		useToast().add({
			title: 'Preencha a Senha',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	if (!repetirSenha.value) {
		useToast().add({
			title: 'Preencha a Validação de Senha(repetir)',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	if (!useValidateEmail(email.value)) {
		useToast().add({
			title: 'Preencha um Email Pessoal Válido',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	if (useIsCBPFMail(email.value)) {
		useToast().add({
			title: 'Email do CBPF não pode ser cadastrado como Email Pessoal',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	if (!useValidatePasswd(senha.value)) {
		useToast().add({
			title:
				'Senha deve conter mínimo de 8 dígitos, 1 letra maiúsculas, 1 letra minúsculas, 1 número e 1 símbolo',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	if (senha.value !== repetirSenha.value) {
		useToast().add({
			title: 'Senhas não coincidem',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingCriar.value = false)
	}
	fetch('/api/insert/usuario', {
		method: 'POST',
		body: JSON.stringify({
			foto: foto.value,
			uid: uid.value,
			nome: nome.value,
			sobrenome: sobrenome.value,
			ramal: ramal.value,
			telefone: telefone.value,
			email: email.value,
			senha: senha.value,
			validade: validade.value,
			descricao: descricao.value,
			coordenacoes: coordenacoesSelecionadas.value,
			grupos: gruposSelecionados.value
		})
	})
		.then(async (res) => {
			if (res.ok) {
				useToast().add({
					title: 'Usuário criado com sucesso!',
					icon: 'i-heroicons-check-badge',
					color: 'green'
				})
				loadingCriar.value = false
				return navigateTo(`/usuarios/${uid.value}`)
			}
			const err: ErroReq = await res.json()
			useToast().add({
				title: err.message,
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red'
			})
			loadingCriar.value = false
		})
		.catch(() => {
			useToast().add({
				title: 'Ocorreu um erro desconhecido',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red'
			})
			loadingCriar.value = false
		})
}
</script>

<template>
	<UCard
		class="w-full min-h-[calc(100vh-131px)]"
		:ui="{
			divide: 'divide-y divide-gray-200 dark:divide-gray-700',
			header: {padding: 'px-4 py-5'},
			body: {base: 'divide-y divide-gray-200 dark:divide-gray-700'},
			footer: {padding: 'p-4'}
		}"
	>
		<template #header>
			<h2 class="text-center">{{ uid }}</h2>
			<div class="flex justify-center mt-2">
				<div
					class="flex relative cursor-pointer"
					:class="{'cursor-pointer': level === 'Administrador', group: level === 'Administrador'}"
					@click="abrirModalFoto"
				>
					<img
						v-if="foto.length > 0"
						class="w-24 h-24 rounded-full"
						:src="'data:image/jpeg;base64,' + foto"
						alt="Usuário sem foto"
					/>
					<img
						v-else
						class="w-24 h-24 rounded-full"
						src="~/assets/images/nopic.jpg"
						alt="Usuário sem foto"
					/>
					<div
						class="w-24 h-24 bg-slate-950 opacity-70 rounded-full absolute invisible group-hover:visible flex justify-center items-center"
					>
						<UIcon name="i-heroicons-camera" class="text-white text-xl" />
					</div>
				</div>
			</div>
		</template>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="uid-form"
					>ID CBPF</label
				>
				<UInput
					id="uid-form"
					icon="i-heroicons-user"
					v-model="uid"
					:disabled="level === 'Auditor'"
					@keydown.space.prevent
					@keyup="uid = uid.toLocaleLowerCase()"
				/>
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="nome-form"
					>Nome</label
				>
				<UInput
					id="nome-form"
					icon="i-heroicons-identification"
					v-model="nome"
					@keydown.space.prevent
					:disabled="level === 'Auditor'"
				/>
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="sobrenome-form"
					>Sobrenome</label
				>
				<UInput
					id="sobrenome-form"
					icon="i-heroicons-credit-card"
					v-model="sobrenome"
					:disabled="level === 'Auditor'"
				/>
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="ramal-form"
					>Ramal</label
				>
				<UInput
					id="ramal-form"
					icon="i-heroicons-phone"
					v-model="ramal"
					@keydown="useIsNumber"
					:disabled="level === 'Auditor'"
				/>
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="telefone-form"
					>Telefone</label
				>
				<UInput
					id="telefone-form"
					icon="i-heroicons-device-phone-mobile"
					v-model="telefone"
					@keydown="useIsNumber"
					:disabled="level === 'Auditor'"
				/>
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="email-form"
					>Email Pessoal</label
				>
				<UInput
					id="email-form"
					icon="i-heroicons-envelope"
					v-model="email"
					:disabled="level === 'Auditor'"
				/>
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="senha-form"
					>Senha</label
				>
				<UInput
					id="senha-form"
					icon="i-heroicons-key"
					type="password"
					v-model="senha"
					:disabled="level === 'Auditor'"
				/>
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="repetir-senha-form"
					>Repetir Senha</label
				>
				<UInput
					id="repetir-senha-form"
					icon="i-heroicons-shield-exclamation"
					type="password"
					v-model="repetirSenha"
					:disabled="level === 'Auditor'"
				/>
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="validade-form"
					>Validade</label
				>
				<VDatePicker id="validade-form" v-model="validade" :disabled="level === 'Auditor'" />
			</div>
			<div class="w-full col-span-1 sm:col-span-2 md:col-span-3">
				<label
					class="block mb-2 ms-1 text-sm font-medium text-gray-900 dark:text-white"
					for="descricao-form"
					>Descrição</label
				>
				<UTextarea
					id="descricao-form"
					v-model="descricao"
					autoresize
					:disabled="level === 'Auditor'"
				/>
			</div>
			<div class="w-full col-span-1 sm:col-span-2 md:col-span-3 border border-gray-700 p-5">
				<h4 class="text-center mb-4">Coordenações</h4>
				<div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4 place-items-center">
					<div
						v-if="coordenacoes"
						v-for="coordenacao in coordenacoes"
						:key="coordenacao.cn"
						class="w-full text-center sm:text-start sm:ms-24"
					>
						<UTooltip :text="coordenacao.description" :popper="{placement: 'top'}">
							<UCheckbox
								:label="coordenacao.cn"
								:value="coordenacao.cn"
								v-model="coordenacoesSelecionadas"
								:disabled="level === 'Auditor'"
							/>
						</UTooltip>
					</div>
				</div>
			</div>
			<div class="w-full col-span-1 sm:col-span-2 md:col-span-3 border border-gray-700 p-5">
				<h4 class="text-center mb-4">Grupos</h4>
				<div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4 place-items-center">
					<div
						v-if="grupos"
						v-for="grupo in grupos"
						:key="`${grupo.subgrupo} - ${grupo.grupo}`"
						class="w-full text-center sm:text-start sm:ms-24"
					>
						<UTooltip :text="grupo.description" :popper="{placement: 'top'}">
							<UCheckbox
								:label="`${grupo.subgrupo} - ${grupo.grupo}`"
								:value="`${grupo.subgrupo} - ${grupo.grupo}`"
								v-model="gruposSelecionados"
								:disabled="level === 'Auditor'"
							/>
						</UTooltip>
					</div>
				</div>
			</div>
		</div>
		<template #footer>
			<div class="flex space-x-2 justify-center">
				<UButton
					v-if="level === 'Administrador'"
					icon="i-heroicons-user-plus"
					label="Criar"
					color="green"
					@click="criar"
					:loading="loadingCriar"
				/>
			</div>
		</template>
	</UCard>

	<UModal v-model="modalFoto" :ui="{width: '!w-3/5'}">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: {background: 'bg-cyan-500'}
			}"
		>
			<template #header>
				<h3 class="text-center">Foto de Perfil</h3>
			</template>
			<span>
				Uma foto institucional ideal deve ser tirada acima dos ombros, sem o uso de acessórios, como
				chapéus. Isso garante um enquadramento focado na expressão facial, transmitindo uma imagem
				profissional e confiável. Evitar acessórios ajuda a manter a clareza e a atenção direcionada
				ao rosto.
			</span>
			<USkeleton class="m-auto h-96 w-96 mt-4" v-if="loadingWebcam" />
			<div class="m-4 flex justify-center relative" v-show="webcamStream">
				<video v-show="!fotoTirada" ref="webcamDiv" autoplay="true"></video>
				<img v-show="fotoTirada" ref="imgFotoTirada" src="" />
				<UButton
					class="absolute bottom-[-15px]"
					icon="i-heroicons-camera"
					color="green"
					:ui="{rounded: 'rounded-full'}"
					@click="recFoto"
					v-if="!fotoTirada"
				/>
				<UButton
					class="absolute bottom-[-15px]"
					icon="i-heroicons-arrow-uturn-left"
					color="red"
					:ui="{rounded: 'rounded-full'}"
					@click="fotoTirada = false"
					v-else
				/>
			</div>

			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton label="Enviar Arquivo" color="blue" icon="i-heroicons-photo" @click="open" />
					<UButton
						label="Abrir Câmera"
						color="green"
						icon="i-heroicons-camera"
						v-if="!webcamStream"
						:disabled="loadingWebcam"
						@click="iniciarCamera"
					/>
					<UButton
						label="Enviar esta Foto"
						color="green"
						icon="i-heroicons-camera"
						v-else
						@click="escolherFotoTirada"
						:disabled="!fotoTirada"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
