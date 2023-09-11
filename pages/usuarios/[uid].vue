<script setup lang="ts">
const {uid} = useRoute().params
const idcbpf = ref(typeof uid === 'string' ? uid : uid[0])
definePageMeta({
	middleware: 'is-authenticated'
})
useHead({
	title: `ID - ${uid}`
})
</script>

<template>
	<section>
		<EditarUsuario :idcbpf="idcbpf" />
	</section>
</template>
