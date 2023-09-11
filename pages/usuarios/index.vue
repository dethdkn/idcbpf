<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated'
})
useHead({
	title: `ID - Usuários`
})
</script>

<template>
	<section>
		<TableUsuarios />
	</section>
</template>
