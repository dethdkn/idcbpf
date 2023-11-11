<script setup lang="ts">
const { data, error, pending } = await useFetch('/api/fetch/logs')
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}

const colunas = [
	{
		key: 'data',
		label: 'Data',
		sortable: true,
	},
	{
		key: 'usuario',
		label: 'Usuário',
		sortable: true,
	},
	{
		key: 'acao',
		label: 'Ação',
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
const logsFiltro = computed(() => {
	if (pesquisar.value && data.value) {
		return data.value.filter((item) => {
			return Object.values(item).some((value) => {
				return String(value).toLowerCase().includes(pesquisar.value.toLowerCase())
			})
		})
	}
	return data.value
})

const logs = computed(() => {
	if (logsFiltro.value) {
		return logsFiltro.value.slice(
			(page.value - 1) * pageCount.value.qnt,
			page.value * pageCount.value.qnt,
		)
	}
	return logsFiltro.value
})

watch(pesquisar, (nv) => {
	if (nv.length > 0)
		page.value = 1
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
		<div class="flex items-center justify-between gap-3 px-4 py-3">
			<label for="pesquisar-log" class="hidden">Pesquisar Log</label>
			<UInput
				id="pesquisar-log"
				v-model="pesquisar"
				icon="i-heroicons-magnifying-glass-20-solid"
				placeholder="Pesquisar..."
			/>
			<USelectMenu v-if="data" v-model="pageCount" :options="opcoesPags" option-attribute="txt" />
		</div>
		<ClientOnly>
			<template #fallback>
				<USkeleton class="w-full h-[calc(100vh-300px)] mr-3" />
			</template>
			<UTable
				v-if="logs"
				:rows="logs"
				:columns="colunas"
				:loading="pending"
				:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Carregando...' }"
				:empty-state="{
					icon: 'i-heroicons-circle-stack-20-solid',
					label: 'Nenhum log encontrado.',
				}"
				sort-asc-icon="i-heroicons-arrow-up"
				sort-desc-icon="i-heroicons-arrow-down"
			>
				<template #data-data="{ row }">
					<span class="hidden">{{ row.data }}</span>
					<span>{{
						new Date(row.data).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
					}}</span>
				</template>
				<template #usuario-data="{ row }">
					<UBadge
						v-if="row.usuario"
						size="xs"
						:label="row.usuario"
						color="teal"
						variant="outline"
					/>
				</template>
			</UTable>
		</ClientOnly>
		<template #footer>
			<div class="flex justify-end">
				<UPagination
					v-if="logsFiltro"
					v-model="page"
					:page-count="pageCount.qnt"
					:total="logsFiltro.length"
				/>
			</div>
		</template>
	</UCard>
</template>
