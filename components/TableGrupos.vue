<script setup lang="ts">
const {data, error, refresh, pending} = await useFetch('/api/fetch/grupos')
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
		key: 'grupo',
		label: 'Grupo',
		sortable: true
	},
	{
		key: 'description',
		label: 'Descrição',
		sortable: true
	},
	{
		key: 'acoes',
		label: 'Ações',
		sortable: false
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
const gruposFiltro = computed(() => {
	if (pesquisar.value && data.value)
		return data.value.filter((item) => {
			return Object.values(item).some((value) => {
				return String(value).toLowerCase().includes(pesquisar.value.toLowerCase())
			})
		})
	return data.value
})

const grupos = computed(() => {
	if (gruposFiltro.value)
		return gruposFiltro.value.slice(
			(page.value - 1) * pageCount.value.qnt,
			page.value * pageCount.value.qnt
		)
	return gruposFiltro.value
})

watch(pesquisar, (nv) => {
	if (nv.length > 0) page.value = 1
})

const modalEditar = ref(false)
const loadingEditar = ref(false)
const ouEditar = ref('')
const cnEditar = ref('')
const descricaoEditar = ref('')
watch(modalEditar, (nv) => {
	if (!nv) {
		descricaoEditar.value = ''
		loadingExcluir.value = false
	}
})
const abrirEditar = (cn: string, ou: string) => {
	ouEditar.value = ou
	cnEditar.value = cn
	modalEditar.value = true
}
const editar = () => {
	loadingExcluir.value = true
	if (!descricaoEditar.value) {
		useToast().add({
			title: 'Preencha a nova Descrição',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red'
		})
		return (loadingExcluir.value = false)
	}
	fetch('/api/update/grupo', {
		method: 'POST',
		body: JSON.stringify({
			cn: cnEditar.value,
			ou: ouEditar.value,
			descricao: descricaoEditar.value
		})
	})
		.then(async (res) => {
			if (res.ok) {
				refresh()
				modalEditar.value = false
				return useToast().add({
					title: 'Descrição editada com sucesso!',
					icon: 'i-heroicons-check-badge',
					color: 'green'
				})
			}
			const err: ErroReq = await res.json()
			modalEditar.value = false
			useToast().add({
				title: err.message,
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red'
			})
		})
		.catch(() => {
			modalEditar.value = false
			useToast().add({
				title: 'Ocorreu um erro desconhecido',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red'
			})
		})
}

const modalExcluir = ref(false)
const modalExcluir2 = ref(false)
const modalExcluir3 = ref(false)
const loadingExcluir = ref(false)
const ouExcluir = ref('')
const cnExcluir = ref('')
const cnouExcluirDigitado = ref('')
const abrirExcluir = (cn: string, ou: string) => {
	ouExcluir.value = ou
	cnExcluir.value = cn
	modalExcluir.value = true
}
const fecharModais = () => {
	modalExcluir.value = false
	modalExcluir2.value = false
	modalExcluir3.value = false
	ouExcluir.value = ''
	cnExcluir.value = ''
	cnouExcluirDigitado.value = ''
	loadingExcluir.value = false
}
const excluir = () => {
	loadingExcluir.value = true
	fetch('/api/delete/grupo', {
		method: 'POST',
		body: JSON.stringify({
			cn: cnExcluir.value,
			ou: ouExcluir.value
		})
	})
		.then(async (res) => {
			if (res.ok) {
				refresh()
				fecharModais()
				return useToast().add({
					title: 'Subgrupo excluído com sucesso!',
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
			<label for="pesquisar-grupo" class="hidden">Pesquisar Grupo</label>
			<UInput
				id="pesquisar-grupo"
				v-model="pesquisar"
				icon="i-heroicons-magnifying-glass-20-solid"
				placeholder="Pesquisar..."
			/>
			<USelectMenu v-if="data" v-model="pageCount" :options="opcoesPags" option-attribute="txt" />
			<UButton
				v-if="level === 'Administrador'"
				color="green"
				label="Criar Grupo"
				icon="i-heroicons-users"
				to="/grupos/$novo"
			/>
		</div>
		<ClientOnly>
			<template #fallback>
				<USkeleton class="w-full h-[calc(100vh-300px)] mr-3" />
			</template>
			<UTable
				v-if="grupos"
				:rows="grupos"
				:columns="colunas"
				:loading="pending"
				:loading-state="{icon: 'i-heroicons-arrow-path-20-solid', label: 'Carregando...'}"
				:empty-state="{
					icon: 'i-heroicons-circle-stack-20-solid',
					label: 'Nenhum Grupo encontrado.'
				}"
				sort-asc-icon="i-heroicons-arrow-up"
				sort-desc-icon="i-heroicons-arrow-down"
			>
				<template #grupo-data="{row}">
					<span>{{ row.subgrupo }} - {{ row.grupo }}</span>
				</template>
				<template #acoes-data="{row}">
					<div class="flex space-x-2">
						<UTooltip text="Ver Membros" :popper="{placement: 'top'}">
							<UButton
								icon="i-heroicons-user-group"
								size="2xs"
								color="sky"
								variant="soft"
								:ui="{rounded: 'rounded-full'}"
								:to="`/grupos/${row.subgrupo}-${row.grupo}`"
							/>
						</UTooltip>
						<UTooltip
							text="Editar Descrição"
							:popper="{placement: 'top'}"
							v-if="level === 'Administrador'"
						>
							<UButton
								icon="i-heroicons-pencil-square"
								size="2xs"
								variant="soft"
								:ui="{rounded: 'rounded-full'}"
								@click="abrirEditar(row.subgrupo, row.grupo)"
							/>
						</UTooltip>
						<UTooltip
							text="Excluir Subgrupo"
							:popper="{placement: 'top'}"
							v-if="level === 'Administrador'"
						>
							<UButton
								icon="i-heroicons-trash"
								size="2xs"
								color="red"
								variant="soft"
								:ui="{rounded: 'rounded-full'}"
								@click="abrirExcluir(row.subgrupo, row.grupo)"
							/>
						</UTooltip>
					</div>
				</template>
			</UTable>
		</ClientOnly>
		<template #footer>
			<div class="flex justify-end">
				<UPagination
					v-if="gruposFiltro"
					v-model="page"
					:page-count="pageCount.qnt"
					:total="gruposFiltro.length"
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
				<h3 class="text-center select-none">Excluir Subgrupo {{ cnExcluir }} - {{ ouExcluir }}</h3>
			</template>
			<span class="block text-sm text-center font-medium text-gray-900 dark:text-white"
				>Tem certeza que deseja excluir este Subgrupo?</span
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
				<h3 class="text-center select-none">Excluir Subgrupo {{ cnExcluir }} - {{ ouExcluir }}</h3>
			</template>
			<span class="block text-sm text-center font-medium text-gray-900 dark:text-white"
				>Tem certeza que deseja excluir o subgrupo '{{ cnExcluir }} - {{ ouExcluir }}'?
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
				<h3 class="text-center select-none">Excluir Subgrupo {{ cnExcluir }} - {{ ouExcluir }}</h3>
			</template>
			<label
				class="block mb-2 text-sm text-center font-medium text-gray-900 dark:text-white"
				for="excluir-form"
				>Para confirmar, digite o nome do subgrupo/grupo abaixo</label
			>
			<UInput id="excluir-form" icon="i-heroicons-trash" v-model="cnouExcluirDigitado" />
			<p class="text-center mt-2 select-none">{{ cnExcluir }} - {{ ouExcluir }}</p>
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
						:disabled="cnouExcluirDigitado !== `${cnExcluir} - ${ouExcluir}`"
					/>
				</div>
			</template>
		</UCard>
	</UModal>

	<UModal v-model="modalEditar" :ui="{width: '!w-2/5'}">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: {background: 'bg-blue-500'}
			}"
		>
			<template #header>
				<h3 class="text-center select-none">
					Editar Descrição do Subgrupo {{ cnEditar }} - {{ ouEditar }}
				</h3>
			</template>
			<label
				class="block mb-2 text-sm text-center font-medium text-gray-900 dark:text-white"
				for="descricao-form"
				>Nova Descrição</label
			>
			<UTextarea
				id="descricao-form"
				v-model="descricaoEditar"
				autoresize
				:disabled="level === 'Auditor'"
			/>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="red"
						icon="i-heroicons-x-circle"
						@click="modalEditar = false"
						:disabled="loadingEditar"
					/>
					<UButton
						label="Editar"
						icon="i-heroicons-pencil"
						@click="editar"
						:loading="loadingEditar"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
