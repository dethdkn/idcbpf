<script setup lang="ts">
const { subgrupo, grupo } = useRoute().params
const cn = ref(typeof subgrupo === 'string' ? subgrupo : subgrupo[0])
const ou = ref(typeof grupo === 'string' ? grupo : grupo[0])
definePageMeta({
	middleware: 'is-authenticated',
})
useHead({
	title: `${cn.value} - ${ou.value}`,
})
</script>

<template>
	<section>
		<TableMembros :cn="cn" :ou="ou" />
	</section>
</template>
