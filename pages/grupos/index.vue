<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated',
})
useHead({
	title: `Grupos`,
})
</script>

<template>
	<section>
		<TableGrupos />
	</section>
</template>
