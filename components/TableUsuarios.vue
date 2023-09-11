<script setup lang="ts">
const {data, error, refresh, pending} = await useFetch('/api/fetch/idscbpf')
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const {statusCode, statusMessage, message} = err
		throw createError({statusCode, statusMessage, message})
	}
}

const {level} = storeToRefs(userStore())

const colunas = [
	{
		key: 'uid',
		label: 'ID CBPF',
		sortable: true
	},
	{
		key: 'cn',
		label: 'Nome',
		sortable: true
	},
	{
		key: 'lastModifiedBy',
		label: 'Última Modificação Por',
		sortable: true
	},
	{
		key: 'timeStamp',
		label: 'Última Modificação Em',
		sortable: true
	},
	{
		key: 'userValidity',
		label: 'Validade da Conta',
		sortable: true
	},
	{
		key: 'description',
		label: 'Descrição',
		sortable: true
	},
	{
		key: 'acoes',
		label: 'Ações'
	}
]

const page = ref(1)
const opcoesPags = ref([
	{qnt: 10, txt: 'Mostrar 10 Itens'},
	{qnt: 50, txt: 'Mostrar 50 Itens'},
	{qnt: 100, txt: 'Mostrar 100 Itens'},
	{qnt: data.value?.length, txt: `Mostrar ${data.value?.length} Itens`}
])
const pageCount = ref({qnt: 10, txt: 'Mostrar 10 Itens'})

const pesquisar = ref('')
const userFiltro = computed(() => {
	if (pesquisar.value && data.value)
		return data.value.filter((item) => {
			return Object.values(item).some((value) => {
				return String(value).toLowerCase().includes(pesquisar.value.toLowerCase())
			})
		})
	return data.value
})

const usuarios = computed(() => {
	if (userFiltro.value)
		return userFiltro.value.slice(
			(page.value - 1) * pageCount.value.qnt,
			page.value * pageCount.value.qnt
		)
	return userFiltro.value
})

watch(pesquisar, (nv) => {
	if (nv.length > 0) page.value = 1
})

const stringToData = (dString: string): string => {
	if (typeof dString === 'string' && dString.includes('-')) {
		const partesData = dString.split('-')
		return new Date(
			Number(partesData[0]),
			Number(partesData[1]),
			Number(partesData[2])
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
const abrirExcluir = (uid: string) => {
	uidExcluir.value = uid
	modalExcluir.value = true
}
const fecharModais = () => {
	modalExcluir.value = false
	modalExcluir2.value = false
	modalExcluir3.value = false
	uidExcluir.value = ''
	uidExcluirDigitado.value = ''
	loadingExcluir.value = false
}
const excluir = () => {
	loadingExcluir.value = true
	fetch('/api/delete/usuario', {
		method: 'POST',
		body: JSON.stringify({
			uid: uidExcluir.value
		})
	})
		.then(async (res) => {
			if (res.ok) {
				refresh()
				fecharModais()
				return useToast().add({
					title: 'Usuário excluído com sucesso!',
					icon: 'i-heroicons-check-badge',
					color: 'green'
				})
			}
			const err: ErroReq = await res.json()
			useToast().add({
				title: err.message,
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red'
			})
			fecharModais()
		})
		.catch(() => {
			useToast().add({
				title: 'Ocorreu um erro desconhecido',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red'
			})
			fecharModais()
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
				:loading-state="{icon: 'i-heroicons-arrow-path-20-solid', label: 'Carregando...'}"
				:empty-state="{
					icon: 'i-heroicons-circle-stack-20-solid',
					label: 'Nenhum usuário encontrado.'
				}"
				sort-asc-icon="i-heroicons-arrow-up"
				sort-desc-icon="i-heroicons-arrow-down"
			>
				<template #lastModifiedBy-data="{row}">
					<UBadge
						v-if="row.lastModifiedBy"
						size="xs"
						:label="row.lastModifiedBy"
						color="teal"
						variant="outline"
					/>
				</template>
				<template #timeStamp-data="{row}">
					<span v-if="row.timeStamp">{{
						new Date(row.timeStamp).toLocaleDateString('pt-BR')
					}}</span>
				</template>
				<template #userValidity-data="{row}">
					<span>{{ stringToData(row.userValidity) }}</span>
				</template>
				<template #description-data="{row}">
					<UTooltip
						:text="row.description"
						:popper="{placement: 'top'}"
						class="cursor-context-menu"
					>
						<UIcon name="i-heroicons-eye" />
					</UTooltip>
				</template>
				<template #acoes-data="{row}">
					<div class="flex space-x-2">
						<UTooltip text="Editar Usuário" :popper="{placement: 'top'}">
							<UButton
								icon="i-heroicons-pencil-square"
								size="2xs"
								variant="soft"
								:ui="{rounded: 'rounded-full'}"
								:to="`/usuarios/${row.uid}`"
							/>
						</UTooltip>
						<UTooltip
							text="Excluir Usuário"
							:popper="{placement: 'top'}"
							v-if="level === 'Administrador'"
						>
							<UButton
								icon="i-heroicons-trash"
								size="2xs"
								color="red"
								variant="soft"
								:ui="{rounded: 'rounded-full'}"
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

	<UModal v-model="modalExcluir" :ui="{width: '!w-1/5'}">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: {background: 'bg-red-500'}
			}"
		>
			<template #header>
				<h3 class="text-center select-none">Excluir Usuário - {{ uidExcluir }}</h3>
			</template>
			<span class="block text-sm text-center font-medium text-gray-900 dark:text-white"
				>Tem certeza que deseja excluir este usuário?</span
			>
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

	<UModal v-model="modalExcluir2" :ui="{width: '!w-2/5'}">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: {background: 'bg-red-500'}
			}"
		>
			<template #header>
				<h3 class="text-center select-none">Excluir Usuário - {{ uidExcluir }}</h3>
			</template>
			<span class="block text-sm text-center font-medium text-gray-900 dark:text-white"
				>Tem certeza que deseja excluir o usuário '{{ uidExcluir }}'?
				<strong>ESSA AÇÃO NÃO PODERÁ SER DESFEITA!</strong></span
			>
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

	<UModal v-model="modalExcluir3" :ui="{width: '!w-3/5'}">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: {background: 'bg-red-500'}
			}"
		>
			<template #header>
				<h3 class="text-center select-none">Excluir Usuário - {{ uidExcluir }}</h3>
			</template>
			<label
				class="block mb-2 text-sm text-center font-medium text-gray-900 dark:text-white"
				for="excluir-form"
				>Para confirmar, digite o nome do usuário abaixo</label
			>
			<UInput id="excluir-form" icon="i-heroicons-trash" v-model="uidExcluirDigitado" />
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="green"
						icon="i-heroicons-x-circle"
						@click="fecharModais"
						:disabled="loadingExcluir"
					/>
					<UButton
						label="Excluir"
						color="red"
						icon="i-heroicons-trash"
						@click="excluir"
						:loading="loadingExcluir"
						:disabled="uidExcluir !== uidExcluirDigitado"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
