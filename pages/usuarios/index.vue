<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated',
})
useHead({
	title: `Usuários`,
})
</script>

<template>
	<section>
		<TableUsuarios />
	</section>
</template>
