<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated'
})
useHead({
	title: `ID - Criar Grupo`
})
</script>

<template>
	<section>
		<FormGrupo />
	</section>
</template>
