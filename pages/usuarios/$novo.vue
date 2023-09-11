<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated'
})
useHead({
	title: `ID - Criar Usuário`
})
</script>

<template>
	<section>
		<FormUsuario />
	</section>
</template>
