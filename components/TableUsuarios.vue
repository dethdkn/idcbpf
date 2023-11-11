<script setup lang="ts">
const { data, error, refresh, pending } = await useFetch('/api/fetch/idscbpf')
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}

const { level } = storeToRefs(userStore())

const colunas = [
	{
		key: 'uid',
		label: 'ID CBPF',
		sortable: true,
	},
	{
		key: 'cn',
		label: 'Nome',
		sortable: true,
	},
	{
		key: 'lastModifiedBy',
		label: 'Última Modificação Por',
		sortable: true,
	},
	{
		key: 'timeStamp',
		label: 'Última Modificação Em',
		sortable: true,
	},
	{
		key: 'userValidity',
		label: 'Validade da Conta',
		sortable: true,
	},
	{
		key: 'description',
		label: 'Descrição',
		sortable: true,
	},
	{
		key: 'acoes',
		label: 'Ações',
	},
]

const page = ref(1)
const opcoesPags = ref([
	{ qnt: 10, txt: 'Mostrar 10 Itens' },
	{ qnt: 50, txt: 'Mostrar 50 Itens' },
	{ qnt: 100, txt: 'Mostrar 100 Itens' },
	{ qnt: data.value?.length, txt: `Mostrar ${data.value?.length} Itens` },
])
const pageCount = ref({ qnt: 10, txt: 'Mostrar 10 Itens' })

const pesquisar = ref('')
const userFiltro = computed(() => {
	if (pesquisar.value && data.value) {
		return data.value.filter((item) => {
			return Object.values(item).some((value) => {
				return String(value).toLowerCase().includes(pesquisar.value.toLowerCase())
			})
		})
	}
	return data.value
})

const usuarios = computed(() => {
	if (userFiltro.value) {
		return userFiltro.value.slice(
			(page.value - 1) * pageCount.value.qnt,
			page.value * pageCount.value.qnt,
		)
	}
	return userFiltro.value
})

watch(pesquisar, (nv) => {
	if (nv.length > 0)
		page.value = 1
})

function stringToData(dString: string): string {
	if (typeof dString === 'string' && dString.includes('-')) {
		const partesData = dString.split('-')
		return new Date(
			Number(partesData[0]),
			Number(partesData[1]),
			Number(partesData[2]),
		).toLocaleDateString('pt-BR')
	}
	return ''
}

const modalExcluir = ref(false)
const modalExcluir2 = ref(false)
const modalExcluir3 = ref(false)
const loadingExcluir = ref(false)
const uidExcluir = ref('')
const uidExcluirDigitado = ref('')
function abrirExcluir(uid: string) {
	uidExcluir.value = uid
	modalExcluir.value = true
}
function fecharModais() {
	modalExcluir.value = false
	modalExcluir2.value = false
	modalExcluir3.value = false
	uidExcluir.value = ''
	uidExcluirDigitado.value = ''
	loadingExcluir.value = false
}
async function excluir() {
	loadingExcluir.value = true
	const res = await $fetch('/api/delete/usuario', {
		method: 'POST',
		body: {
			uid: uidExcluir.value,
		},
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		fecharModais()
	})
	if (res) {
		refresh()
		fecharModais()
		return useToast().add({
			title: 'Usuário excluído com sucesso!',
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
		<div class="flex items-center justify-between gap-3 px-4 py-3">
			<label for="pesquisar-usuario" class="hidden">Pesquisar Usuário</label>
			<UInput
				id="pesquisar-usuario"
				v-model="pesquisar"
				icon="i-heroicons-magnifying-glass-20-solid"
				placeholder="Pesquisar..."
			/>
			<USelectMenu v-if="data" v-model="pageCount" :options="opcoesPags" option-attribute="txt" />
			<UButton
				v-if="level === 'Administrador'"
				color="green"
				label="Criar Usuário"
				icon="i-heroicons-user-plus"
				to="/usuarios/$novo"
			/>
		</div>
		<ClientOnly>
			<template #fallback>
				<USkeleton class="w-full h-[calc(100vh-300px)] mr-3" />
			</template>
			<UTable
				v-if="usuarios"
				:rows="usuarios"
				:columns="colunas"
				:loading="pending"
				:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Carregando...' }"
				:empty-state="{
					icon: 'i-heroicons-circle-stack-20-solid',
					label: 'Nenhum usuário encontrado.',
				}"
				sort-asc-icon="i-heroicons-arrow-up"
				sort-desc-icon="i-heroicons-arrow-down"
			>
				<template #lastModifiedBy-data="{ row }">
					<UBadge
						v-if="row.lastModifiedBy"
						size="xs"
						:label="row.lastModifiedBy"
						color="teal"
						variant="outline"
					/>
				</template>
				<template #timeStamp-data="{ row }">
					<span v-if="row.timeStamp">{{
						new Date(row.timeStamp).toLocaleDateString('pt-BR')
					}}</span>
				</template>
				<template #userValidity-data="{ row }">
					<span>{{ stringToData(row.userValidity) }}</span>
				</template>
				<template #description-data="{ row }">
					<UTooltip
						:text="row.description"
						:popper="{ placement: 'top' }"
						class="cursor-context-menu"
					>
						<UIcon name="i-heroicons-eye" />
					</UTooltip>
				</template>
				<template #acoes-data="{ row }">
					<div class="flex space-x-2">
						<UTooltip text="Editar Usuário" :popper="{ placement: 'top' }">
							<UButton
								icon="i-heroicons-pencil-square"
								size="2xs"
								variant="soft"
								:ui="{ rounded: 'rounded-full' }"
								:to="`/usuarios/${row.uid}`"
							/>
						</UTooltip>
						<UTooltip
							v-if="level === 'Administrador'"
							text="Excluir Usuário"
							:popper="{ placement: 'top' }"
						>
							<UButton
								icon="i-heroicons-trash"
								size="2xs"
								color="red"
								variant="soft"
								:ui="{ rounded: 'rounded-full' }"
								@click="abrirExcluir(row.uid)"
							/>
						</UTooltip>
					</div>
				</template>
			</UTable>
		</ClientOnly>
		<template #footer>
			<div class="flex justify-end">
				<UPagination
					v-if="userFiltro"
					v-model="page"
					:page-count="pageCount.qnt"
					:total="userFiltro.length"
				/>
			</div>
		</template>
	</UCard>

	<UModal v-model="modalExcluir" :ui="{ width: '!w-1/5 sm:max-w-full' }">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-red-500' },
			}"
		>
			<template #header>
				<h3 class="text-center select-none">
					Excluir Usuário - {{ uidExcluir }}
				</h3>
			</template>
			<span class="block text-sm font-medium text-center text-gray-900 dark:text-white">Tem certeza que deseja excluir este usuário?</span>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="green"
						icon="i-heroicons-x-circle"
						@click="fecharModais"
					/>
					<UButton
						label="Excluir"
						color="red"
						icon="i-heroicons-trash"
						@click="modalExcluir2 = true"
					/>
				</div>
			</template>
		</UCard>
	</UModal>

	<UModal v-model="modalExcluir2" :ui="{ width: '!w-2/5 sm:max-w-full' }">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-red-500' },
			}"
		>
			<template #header>
				<h3 class="text-center select-none">
					Excluir Usuário - {{ uidExcluir }}
				</h3>
			</template>
			<span class="block text-sm font-medium text-center text-gray-900 dark:text-white">Tem certeza que deseja excluir o usuário '{{ uidExcluir }}'?
				<strong>ESSA AÇÃO NÃO PODERÁ SER DESFEITA!</strong></span>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="green"
						icon="i-heroicons-x-circle"
						@click="fecharModais"
					/>
					<UButton
						label="Excluir"
						color="red"
						icon="i-heroicons-trash"
						@click="modalExcluir3 = true"
					/>
				</div>
			</template>
		</UCard>
	</UModal>

	<UModal v-model="modalExcluir3" :ui="{ width: '!w-3/5 sm:max-w-full' }">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-red-500' },
			}"
		>
			<template #header>
				<h3 class="text-center select-none">
					Excluir Usuário - {{ uidExcluir }}
				</h3>
			</template>
			<label
				class="block mb-2 text-sm font-medium text-center text-gray-900 dark:text-white"
				for="excluir-form"
			>Para confirmar, digite o nome do usuário abaixo</label>
			<UInput id="excluir-form" v-model="uidExcluirDigitado" icon="i-heroicons-trash" />
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="green"
						icon="i-heroicons-x-circle"
						:disabled="loadingExcluir"
						@click="fecharModais"
					/>
					<UButton
						label="Excluir"
						color="red"
						icon="i-heroicons-trash"
						:loading="loadingExcluir"
						:disabled="uidExcluir !== uidExcluirDigitado"
						@click="excluir"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
