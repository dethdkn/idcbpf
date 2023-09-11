<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated'
})
useHead({
	title: `ID - Logs`
})
</script>

<template>
	<section>
		<TableLogs />
	</section>
</template>
