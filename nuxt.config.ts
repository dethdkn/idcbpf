const {
	SITE_URL,
	JWT,
	MONGO_URL,
	MONGO_USERNAME,
	MONGO_PASSWORD,
	MONGO_DB_NAME,
	LDAP_URL,
	LDAP_DN,
	LDAP_PASSWORD,
	LDAP_PEOPLE_DN,
	LDAP_GROUPS_DN,
	LDAP_COORDINATIONS_DN,
	CREATE_HOME_SH,
	DEV_URL,
	DEV_KEY,
	DEV_CERT
} = process.env
export default defineNuxtConfig({
	css: ['~/assets/sass/global.sass', 'v-calendar/style.css'],
	modules: ['@nuxthq/ui', '@vueuse/nuxt', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
	pinia: {
		autoImports: ['defineStore', 'storeToRefs']
	},
	image: {
		dir: 'assets/images'
	},
	runtimeConfig: {
		public: {
			siteUrl: SITE_URL,
			JWT,
			MONGO_URL,
			MONGO_USERNAME,
			MONGO_PASSWORD,
			MONGO_DB_NAME,
			LDAP_URL,
			LDAP_DN,
			LDAP_PASSWORD,
			LDAP_PEOPLE_DN,
			LDAP_GROUPS_DN,
			LDAP_COORDINATIONS_DN,
			CREATE_HOME_SH
		}
	},
	app: {
		head: {
			htmlAttrs: {lang: 'pt-BR'},
			title: 'ID - CBPF',
			meta: [
				{'http-equiv': 'X-UA-Compatible', content: 'IE=edge'},
				{name: 'robots', content: 'index, follow'},
				{property: 'og:type', content: 'website'},
				{property: 'og:title', content: 'ID - CBPF'},
				{property: 'twitter:title', content: 'ID - CBPF'},
				{property: 'og:site_name', content: 'ID - CBPF'},
				{property: 'og:url', content: SITE_URL},
				{
					property: 'og:image',
					content: SITE_URL + '/entrada.jpg'
				},
				{
					property: 'twitter:image',
					content: SITE_URL + '/entrada.jpg'
				},
				{property: 'twitter:card', content: 'summary'},
				{property: 'twitter:creator', content: '@cbpf_mcti'},
				{
					name: 'description',
					content: 'Gerência de contas ldap do CBPF'
				},
				{
					property: 'og:description',
					content: 'Gerência de contas ldap do CBPF'
				},
				{
					property: 'twitter:description',
					content: 'Gerência de contas ldap do CBPF'
				}
			],
			link: [
				{rel: 'canonical', href: SITE_URL},
				{
					rel: 'icon',
					href: '/favicon.ico',
					type: 'image/x-icon'
				}
			]
		},
		pageTransition: {name: 'slide-right', mode: 'out-in'}
	},
	devServer: {
		host: DEV_URL,
		https: {
			key: DEV_KEY,
			cert: DEV_CERT
		}
	},
	devtools: {
		enabled: true,
		timeline: {enabled: true}
	}
})
