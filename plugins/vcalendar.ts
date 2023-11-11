import { Calendar, DatePicker, setupCalendar } from 'v-calendar'

export default defineNuxtPlugin(({ vueApp }) => {
	vueApp.use(setupCalendar, {
		locales: {
			'pt-BR': {
				firstDayOfWeek: 0,
				masks: {
					L: 'DD-MM-YYYY',
					weekdays: 'WWW',
					navMonths: 'MMM',
				},
				dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
				dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
				dayNamesShorter: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sá'],
				dayNamesNarrow: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
				monthNames: [
					'Janeiro',
					'Fevereiro',
					'Março',
					'Abril',
					'Maio',
					'Junho',
					'Julho',
					'Agosto',
					'Setembro',
					'Outubro',
					'Novembro',
					'Dezembro',
				],
				monthNamesShort: [
					'Jan',
					'Fev',
					'Mar',
					'Abr',
					'Mai',
					'Jun',
					'Jul',
					'Ago',
					'Set',
					'Out',
					'Nov',
					'Dez',
				],
			},
		},
	})
	vueApp.component('DatePicker', DatePicker)
	vueApp.component('Calendar', Calendar)
})
