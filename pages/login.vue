<script setup lang="ts">
definePageMeta({
	middleware: 'is-not-authenticated',
})
useHead({
	title: `Login`,
})

const idcbpf = ref('')
const passwd = ref('')
const loading = ref(false)
async function loginExec() {
	loading.value = true
	const data = await $fetch('/authenticate', {
		method: 'post',
		body: { idcbpf: idcbpf.value.replace('@cbpf.br', '').toLowerCase(), passwd: passwd.value },
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
	})
	if (data) {
		userStore().setUserState(data.token, data.isLoggedIn, data.idcbpf, data.level)
		navigateTo('/')
	}
	loading.value = false
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
								class="block mb-2 text-sm font-medium text-gray-900 ms-2 dark:text-white"
							>ID CBPF</label>
							<UInput
								id="idcbpf"
								v-model="idcbpf"
								icon="i-heroicons-envelope"
								size="lg"
								color="white"
								@keydown.space.prevent
								@keydown.enter="loginExec"
							/>
						</div>
						<div>
							<label
								for="senha"
								class="block mb-2 text-sm font-medium text-gray-900 ms-2 dark:text-white"
							>Senha</label>
							<UInput
								id="senha"
								v-model="passwd"
								icon="i-heroicons-key"
								size="lg"
								color="white"
								type="password"
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
