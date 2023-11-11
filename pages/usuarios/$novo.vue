<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated',
})
useHead({
	title: `Criar Usuário`,
})
</script>

<template>
	<section>
		<FormUsuario />
	</section>
</template>
