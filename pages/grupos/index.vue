<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated'
})
useHead({
	title: `ID - Grupos`
})
</script>

<template>
	<section>
		<TableGrupos />
	</section>
</template>
