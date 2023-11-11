<script setup lang="ts">
const menuClosed = ref(true)

const colorMode = useColorMode()
const isDark = computed({
	get() {
		return colorMode.value === 'dark'
	},
	set() {
		colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
	},
})

const { currentRoute: route } = useRouter()
function checkRoute(current: string = '', nav: string[]) {
	return nav.includes(current)
		? 'text-white bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:dark:text-blue-500'
		: 'text-gray-900 hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-700 dark:text-white lg:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700'
}

const { idcbpf, level } = storeToRefs(userStore())

const picture = ref('')
async function baixarFoto() {
	const { data } = await useFetch('/picture', {
		method: 'post',
		body: { idcbpf: idcbpf.value },
	})
	if (data.value)
		return (picture.value = data.value)
	picture.value = ''
}
if (userStore().isLoggedIn)
	baixarFoto()

watch(idcbpf, () => {
	baixarFoto()
})

const goToProfile = async () => await navigateTo(`/usuarios/${idcbpf.value}`)

const userMenu = computed(() => {
	return [
		[
			{
				label: idcbpf.value,
				icon: 'i-heroicons-user-circle',
				click: goToProfile,
			},
			{
				label: level.value ? level.value : 'Usuário',
				icon: 'i-heroicons-ticket',
				click: goToProfile,
			},
		],
		[
			{
				label: 'Sair',
				icon: 'i-heroicons-arrow-right-on-rectangle',
				click: useLogout,
			},
		],
	]
})
</script>

<template>
	<nav class="bg-slate-50 dark:bg-gray-800">
		<div
			class="flex flex-wrap items-center justify-center max-w-screen-xl p-4 mx-auto sm:justify-between"
		>
			<NuxtLink to="/" class="flex items-center">
				<ClientOnly>
					<img
						v-if="isDark"
						src="~/assets/images/cbpf-white.svg"
						class="h-8 mr-3"
						alt="Logo do Centro Brasileiro de Pesquisas Físicas"
					>
					<img
						v-else
						src="~/assets/images/cbpf-color.svg"
						class="h-8 mr-3"
						alt="Logo do Centro Brasileiro de Pesquisas Físicas"
					>
					<template #fallback>
						<USkeleton
							class="w-8 h-8 mr-3"
							:ui="{ rounded: 'rounded-full', background: 'bg-gray-300 dark:bg-gray-600' }"
						/>
					</template>
				</ClientOnly>
				<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ID CBPF</span>
			</NuxtLink>
			<div class="flex items-center mt-4 lg:order-2 sm:mt-0">
				<UDropdown
					v-if="userStore().isLoggedIn"
					:items="userMenu"
					:popper="{ placement: 'bottom-start' }"
				>
					<img
						v-if="picture"
						class="w-8 h-8 rounded-full"
						:src="`data:image/jpeg;base64,${picture}`"
						:alt="idcbpf"
					>
					<img
						v-else
						class="w-8 h-8 rounded-full"
						src="~/assets/images/nopic.jpg"
						alt="Usuário sem foto"
					>
				</UDropdown>
				<UButton
					v-else
					icon="i-heroicons-arrow-left-on-rectangle"
					size="sm"
					color="gray"
					variant="solid"
					label="Acessar"
					to="/login"
				/>
				<ClientOnly>
					<UButton
						:icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
						color="gray"
						aria-label="Tema"
						class="ms-4"
						@click="isDark = !isDark"
					/>
					<template #fallback>
						<USkeleton class="w-8 h-8 ms-4" :ui="{ background: 'bg-gray-300 dark:bg-gray-600' }" />
					</template>
				</ClientOnly>
				<button
					class="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg ms-2 lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
					@click="menuClosed = !menuClosed"
				>
					<svg
						class="w-5 h-5"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 17 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 1h15M1 7h15M1 13h15"
						/>
					</svg>
				</button>
			</div>
			<div
				class="items-center justify-between w-full lg:flex lg:w-auto lg:order-1"
				:class="{ hidden: menuClosed }"
			>
				<ul
					class="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg lg:p-0 bg-gray-50 lg:flex-row lg:space-x-8 lg:mt-0 lg:border-0 lg:bg-slate-50 dark:bg-gray-800 lg:dark:bg-gray-800 dark:border-gray-700"
				>
					<li v-if="['Administrador', 'Auditor'].includes(level)">
						<NuxtLink
							to="/usuarios"
							:class="checkRoute(route.fullPath, ['/usuarios'])"
							class="block py-2 pl-3 pr-4 rounded lg:p-0"
							@click="menuClosed = true"
						>
							Usuários
						</NuxtLink>
					</li>
					<li v-if="['Administrador', 'Auditor'].includes(level)">
						<NuxtLink
							to="/grupos"
							:class="checkRoute(route.fullPath, ['/grupos'])"
							class="block py-2 pl-3 pr-4 rounded lg:p-0"
							@click="menuClosed = true"
						>
							Grupos
						</NuxtLink>
					</li>
					<li v-if="['Administrador', 'Auditor'].includes(level)">
						<NuxtLink
							to="/logs"
							:class="checkRoute(route.fullPath, ['/logs'])"
							class="block py-2 pl-3 pr-4 rounded lg:p-0"
							@click="menuClosed = true"
						>
							Logs
						</NuxtLink>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>
