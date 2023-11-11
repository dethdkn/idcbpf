<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated',
})
useHead({
	title: `Criar Grupo`,
})
</script>

<template>
	<section>
		<FormGrupo />
	</section>
</template>
