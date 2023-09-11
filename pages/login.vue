<script setup lang="ts">
definePageMeta({
	middleware: 'is-not-authenticated'
})
useHead({
	title: `ID - Login`
})

const idcbpf = ref('')
const passwd = ref('')
const loading = ref(false)
const loginExec = async () => {
	loading.value = true
	const {data} = await useFetch('/authenticate', {
		method: 'post',
		body: {idcbpf: idcbpf.value.replace('@cbpf.br', '').toLowerCase(), passwd: passwd.value},
		onRequestError() {
			useToast().add({
				title: 'Ocorreu um erro desconhecido',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red'
			})
			loading.value = false
		},
		onResponseError({response}) {
			useToast().add({
				title: response._data.message,
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red'
			})
			loading.value = false
		}
	})
	if (data.value) {
		const res = data.value
		userStore().setUserState(res.token, res.isLoggedIn, res.idcbpf, res.level)
		navigateTo('/')
	}
}
</script>

<template>
	<section
		class="min-h-[calc(100vh-131px)] bg-[url('~/assets/images/entrada.jpg')] bg-cover bg-center bg-no-repeat"
	>
		<div class="flex flex-col items-center justify-center px-6 mx-auto min-h-[calc(100vh-131px)]">
			<div
				class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
			>
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1
						class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white ms-2"
					>
						ID CBPF - Login
					</h1>
					<div class="space-y-4 md:space-y-6">
						<div>
							<label
								for="idcbpf"
								class="block ms-2 mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>ID CBPF</label
							>
							<UInput
								icon="i-heroicons-envelope"
								id="idcbpf"
								size="lg"
								color="white"
								v-model="idcbpf"
								@keydown.space.prevent
								@keydown.enter="loginExec"
							/>
						</div>
						<div>
							<label
								for="senha"
								class="block ms-2 mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>Senha</label
							>
							<UInput
								icon="i-heroicons-key"
								id="senha"
								size="lg"
								color="white"
								type="password"
								v-model="passwd"
								@keydown.enter="loginExec"
							/>
						</div>
						<UButton
							icon="i-heroicons-arrow-left-on-rectangle"
							variant="solid"
							label="Entrar"
							block
							:loading="loading"
							@click="loginExec"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
