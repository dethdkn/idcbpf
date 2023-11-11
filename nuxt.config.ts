import process from 'node:process'

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
	DEV_CERT,
} = process.env
export default defineNuxtConfig({
	css: ['~/assets/sass/global.sass', 'v-calendar/style.css'],
	modules: ['@nuxt/ui', '@vueuse/nuxt', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', 'nuxt-gtag', '@nuxtseo/module'],
	gtag: {
		id: 'G-70B0BEV7FL',
	},
	site: {
		url: SITE_URL,
		name: 'ID CBPF',
		description:
			'Gerência de contas ldap do CBPF',
		defaultLocale: 'pt-BR',
		identity: {
			type: 'Organization',
		},
		twitter: '@cbpf_mcti',
	},
	robots: {
		disallow: '*',
	},
	runtimeConfig: {
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
		public: {
			SITE_URL,
		},
	},
	app: {
		pageTransition: { name: 'slide-right', mode: 'out-in' },
	},
	devServer: {
		host: DEV_URL,
		https: {
			key: DEV_KEY,
			cert: DEV_CERT,
		},
	},
	devtools: {
		enabled: true,
		timeline: { enabled: true },
	},
})
