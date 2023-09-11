<script setup lang="ts">
const props = defineProps({
	modelValue: {
		type: Date,
		default: null
	}
})

const emit = defineEmits(['update:model-value', 'close'])

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const date = computed({
	get: () => props.modelValue,
	set: (value) => {
		emit('update:model-value', value)
		emit('close')
	}
})

const attrs = [
	{
		key: 'today',
		highlight: {
			color: 'blue',
			fillMode: 'outline',
			class: '!bg-gray-100 dark:!bg-gray-800'
		},
		dates: new Date()
	}
]

const label = computed(() => {
	if (date.value) {
		return date.value.toLocaleDateString('pt-br', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}
	return 'Selecione a Data'
})
</script>

<template>
	<UPopover :popper="{placement: 'bottom-start'}">
		<UButton icon="i-heroicons-calendar-days-20-solid" :label="label" class="w-full" />
		<template #panel="{close}">
			<DatePicker
				v-model="date"
				locale="pt-BR"
				transparent
				borderless
				:attributes="attrs"
				:is-dark="isDark"
				@close="close"
			/>
			<UButton
				icon="i-heroicons-x-circle"
				label="Remover Validade"
				block
				variant="soft"
				@click="emit('update:model-value', undefined)"
			/>
		</template>
	</UPopover>
</template>
