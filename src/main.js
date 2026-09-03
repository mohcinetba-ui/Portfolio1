import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/css/theme.css'
import { persistPlugin } from './stores/plugins/persist'

const app = createApp(App)
const pinia = createPinia()

pinia.use(persistPlugin)

app.use(pinia)
app.use(router)

app.mount('#app')