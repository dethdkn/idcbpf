<template>
	<NuxtLoadingIndicator color="#2563eb" :height="5" />
	<Header />
	<main class="min-h-[calc(100vh-131px)]">
		<slot />
		<UNotifications />
	</main>
	<Footer />
</template>
