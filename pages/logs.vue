<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated',
})
useHead({
	title: `Logs`,
})
</script>

<template>
	<section>
		<TableLogs />
	</section>
</template>
