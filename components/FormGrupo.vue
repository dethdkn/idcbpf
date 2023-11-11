<script setup lang="ts">
const { data, error } = await useFetch('/api/fetch/grupos')
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}

const gruposTopo = computed(() => {
	const gt: string[] = []
	if (data.value) {
		for (const grup of data.value) {
			if (!gt.includes(grup.grupo))
				gt.push(grup.grupo)
		}
	}
	return gt
})

const { level } = storeToRefs(userStore())

const novo = ref(false)
const subgrupo = ref('')
const grupo = ref('')
const descricao = ref('')
const loadingCriar = ref(false)

watch(novo, () => (grupo.value = ''))

async function criar() {
	loadingCriar.value = true
	if (!subgrupo.value) {
		useToast().add({
			title: 'Preencha o Subgrupo',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		return (loadingCriar.value = false)
	}
	if (!grupo.value) {
		useToast().add({
			title: 'Preencha o Grupo Topo',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		return (loadingCriar.value = false)
	}
	const res = await $fetch('/api/insert/grupo', {
		method: 'POST',
		body: {
			subgrupo: subgrupo.value,
			grupo: grupo.value,
			descricao: descricao.value,
			novo: novo.value,
		},
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		loadingCriar.value = false
	})
	if (res) {
		useToast().add({
			title: 'Grupo/Subgrupo criado com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
		loadingCriar.value = false
		return navigateTo(`/grupos/${subgrupo.value}-${grupo.value}`)
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
			<div class="flex justify-center mt-2">
				<UToggle id="novo-form" v-model="novo" />
				<label
					class="block mb-2 text-sm font-medium text-gray-900 ms-2 dark:text-white"
					for="novo-form"
				>Novo Grupo Topo</label>
			</div>
		</template>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 place-items-center">
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="subgrupo-form"
				>Subgrupo</label>
				<UInput
					id="subgrupo-form"
					v-model="subgrupo"
					icon="i-heroicons-users"
					:disabled="level === 'Auditor'"
					@keydown.space.prevent
					@keyup="subgrupo = subgrupo.toLocaleLowerCase()"
				/>
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="grupo-form">Grupo Topo</label>
				<UInput
					v-if="novo"
					id="grupo-form"
					v-model="grupo"
					icon="i-heroicons-user-group"
					:disabled="level === 'Auditor'"
					@keydown.space.prevent
					@keyup="grupo = grupo.toLocaleLowerCase()"
				/>
				<USelectMenu
					v-else
					id="grupo-form"
					v-model="grupo"
					icon="i-heroicons-user-group"
					:options="gruposTopo"
					searchable
					searchable-placeholder="Pesquisar..."
					:disabled="level === 'Auditor'"
				/>
			</div>
			<div class="w-full col-span-1 sm:col-span-2">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 ms-1 dark:text-white"
					for="descricao-form"
				>Descrição</label>
				<UTextarea
					id="descricao-form"
					v-model="descricao"
					autoresize
					:disabled="level === 'Auditor'"
				/>
			</div>
		</div>
		<template #footer>
			<div class="flex justify-center space-x-2">
				<UButton
					v-if="level === 'Administrador'"
					icon="i-heroicons-user-circle"
					label="Criar Grupo/Subgrupo"
					color="green"
					:loading="loadingCriar"
					@click="criar"
				/>
			</div>
		</template>
	</UCard>
</template>
