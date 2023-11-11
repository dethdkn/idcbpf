<script setup lang="ts">
const error = defineProps(['error'])
const { statusCode, message } = error.error
useHead({
	title: `Contas - ${statusCode}`,
})
</script>

<template>
	<NuxtLayout>
		<section>
			<div class="flex flex-col items-center justify-center px-6 mx-auto min-h-[calc(100vh-131px)]">
				<div
					class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
				>
					<div class="p-6 text-center space-y-4 md:space-y-6 sm:p-8">
						<h1 class="text-xl font-bold leading-tight tracking-tight text-red-500 md:text-2xl">
							{{ statusCode }}
						</h1>
						<p
							class="font-bold leading-tight tracking-tight text-gray-900 text-md md:text-2xl dark:text-white"
						>
							{{ message }}
						</p>
					</div>
				</div>
			</div>
		</section>
	</NuxtLayout>
</template>
