<script setup lang="ts">
const { cn, ou } = defineProps({
	cn: {
		type: String,
		required: true,
	},
	ou: {
		type: String,
		required: true,
	},
})

const { data, error, refresh, pending } = await useFetch('/api/fetch/membros', {
	method: 'post',
	body: { cn, ou },
})
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}

const { data: idscbpf, error: error2 } = await useFetch('/api/fetch/idscbpf')
if (error2.value) {
	const err = (error2.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}

const uids = computed(() => {
	if (idscbpf.value)
		return idscbpf.value.map(item => item.uid).sort()
	return null
})

const { level } = storeToRefs(userStore())

const colunas = [
	{
		key: 'membro',
		label: 'Membro',
		sortable: true,
	},
	{
		key: 'acoes',
		label: 'Ações',
		sortable: false,
	},
]

const page = ref(1)
const opcoesPags = ref([
	{ qnt: 10, txt: 'Mostrar 10 Itens' },
	{ qnt: 50, txt: 'Mostrar 50 Itens' },
	{ qnt: 100, txt: 'Mostrar 100 Itens' },
])
const pageCount = ref({ qnt: 10, txt: 'Mostrar 10 Itens' })

const pesquisar = ref('')
const MembrosFiltro = computed(() => {
	if (data.value) {
		const members = data.value.map(item => ({ membro: item }))
		if (pesquisar.value) {
			return members.filter((item) => {
				return Object.values(item).some((value) => {
					return String(value).toLowerCase().includes(pesquisar.value.toLowerCase())
				})
			})
		}
		return members
	}
	return []
})

const membros = computed(() => {
	if (MembrosFiltro.value) {
		return MembrosFiltro.value.slice(
			(page.value - 1) * pageCount.value.qnt,
			page.value * pageCount.value.qnt,
		)
	}
	return MembrosFiltro.value
})

watch(pesquisar, (nv) => {
	if (nv.length > 0)
		page.value = 1
})

const modalAdicionar = ref(false)
const loadingAdicionar = ref(false)
const adicionarSlc = ref('')
watch(modalAdicionar, (nv) => {
	if (!nv) {
		adicionarSlc.value = ''
		loadingAdicionar.value = false
	}
})
async function adicionar() {
	loadingAdicionar.value = true
	if (!adicionarSlc.value) {
		useToast().add({
			title: 'Selecione o membro para adicionar',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		return (loadingAdicionar.value = false)
	}
	const res = await $fetch('/api/insert/membro', {
		method: 'POST',
		body: {
			cn,
			ou,
			member: adicionarSlc.value,
		},
	}).catch((err) => {
		modalAdicionar.value = false
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
	})
	if (res) {
		refresh()
		modalAdicionar.value = false
		return useToast().add({
			title: 'Membro adicionado com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}

const modalRemover = ref(false)
const loadingRemover = ref(false)
const membroRemover = ref('')
function abrirRemover(membro: string) {
	membroRemover.value = membro
	modalRemover.value = true
}
watch(modalRemover, (nv) => {
	if (!nv) {
		loadingRemover.value = false
		membroRemover.value = ''
	}
})
async function remover() {
	loadingRemover.value = true
	if (data.value && data.value.length === 0) {
		useToast().add({
			title: 'O grupo não pode ficar vazio',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		return (loadingRemover.value = false)
	}
	const res = await $fetch('/api/delete/membro', {
		method: 'POST',
		body: JSON.stringify({
			cn,
			ou,
			member: membroRemover.value,
		}),
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		modalRemover.value = false
	})
	if (res) {
		refresh()
		modalRemover.value = false
		return useToast().add({
			title: 'Membro removido com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}
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
				{{ cn }} - {{ ou }}
			</h2>
		</template>
		<div class="flex items-center justify-between gap-3 px-4 py-3">
			<label for="pesquisar-membro" class="hidden">Pesquisar Membro</label>
			<UInput
				id="pesquisar-membro"
				v-model="pesquisar"
				icon="i-heroicons-magnifying-glass-20-solid"
				placeholder="Pesquisar..."
			/>
			<USelectMenu v-if="data" v-model="pageCount" :options="opcoesPags" option-attribute="txt" />
			<UButton
				v-if="level === 'Administrador'"
				color="green"
				label="Adicionar Membro"
				icon="i-heroicons-user-plus"
				@click="modalAdicionar = true"
			/>
		</div>
		<ClientOnly>
			<template #fallback>
				<USkeleton class="w-full h-[calc(100vh-300px)] mr-3" />
			</template>
			<UTable
				v-if="membros"
				:rows="membros"
				:columns="colunas"
				:loading="pending"
				:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Carregando...' }"
				:empty-state="{
					icon: 'i-heroicons-circle-stack-20-solid',
					label: 'Nenhum membro encontrado.',
				}"
				sort-asc-icon="i-heroicons-arrow-up"
				sort-desc-icon="i-heroicons-arrow-down"
			>
				<template #acoes-data="{ row }">
					<div class="flex space-x-2">
						<UTooltip text="Ver Usuário" :popper="{ placement: 'top' }">
							<UButton
								icon="i-heroicons-user"
								size="2xs"
								variant="soft"
								color="cyan"
								:ui="{ rounded: 'rounded-full' }"
								:to="`/usuarios/${row.membro}`"
							/>
						</UTooltip>
						<UTooltip
							v-if="level === 'Administrador'"
							text="Remover Membro"
							:popper="{ placement: 'top' }"
						>
							<UButton
								icon="i-heroicons-trash"
								size="2xs"
								color="red"
								variant="soft"
								:ui="{ rounded: 'rounded-full' }"
								@click="abrirRemover(row.membro)"
							/>
						</UTooltip>
					</div>
				</template>
			</UTable>
		</ClientOnly>
		<template #footer>
			<div class="flex justify-end">
				<UPagination
					v-if="MembrosFiltro"
					v-model="page"
					:page-count="pageCount.qnt"
					:total="MembrosFiltro.length"
				/>
			</div>
		</template>
	</UCard>

	<UModal v-model="modalAdicionar" :ui="{ width: '!w-2/5 sm:max-w-full' }">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-green-500' },
			}"
		>
			<template #header>
				<h3 class="text-center select-none">
					Adicionar membro ao subgrupo {{ cn }} do grupo {{ ou }}
				</h3>
			</template>
			<label
				class="block mb-2 text-sm font-medium text-center text-gray-900 dark:text-white"
				for="membro-form"
			>ID CBPF</label>
			<USelect
				v-if="uids"
				id="membro-form"
				v-model="adicionarSlc"
				icon="i-heroicons-user"
				:options="uids"
				:disabled="level === 'Auditor'"
			/>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="red"
						icon="i-heroicons-x-circle"
						:disabled="loadingAdicionar"
						@click="modalAdicionar = false"
					/>
					<UButton
						label="Adicionar"
						icon="i-heroicons-users"
						color="green"
						:loading="loadingAdicionar"
						@click="adicionar"
					/>
				</div>
			</template>
		</UCard>
	</UModal>

	<UModal v-model="modalRemover" :ui="{ width: '!w-2/5 sm:max-w-full' }">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-red-500' },
			}"
		>
			<template #header>
				<h3 class="text-center select-none">
					Remover membro do subgrupo {{ cn }} do grupo {{ ou }}
				</h3>
			</template>
			<span class="block text-sm font-medium text-center text-gray-900 dark:text-white">Tem certeza que deseja excluir o(a) '{{ membroRemover }}' deste subgrupo?
				<strong>ESSA AÇÃO NÃO PODERÁ SER DESFEITA!</strong></span>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="green"
						icon="i-heroicons-x-circle"
						:disabled="loadingRemover"
						@click="modalRemover = false"
					/>
					<UButton
						label="Excluir"
						color="red"
						icon="i-heroicons-trash"
						:loading="loadingRemover"
						@click="remover"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
