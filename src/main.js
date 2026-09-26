import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// Theme CSS (blueprint style) — applies across the whole app
import './assets/css/theme.css'
// Persistence plugin — saves/restores store state to/from localStorage
import { persistPlugin } from './stores/plugins/persist'

// Create the app instance with App.vue as the root component
const app = createApp(App)
// Create the Pinia instance (state management)
const pinia = createPinia()

// Hook the persistence plugin into Pinia — this makes it apply to EVERY store automatically
pinia.use(persistPlugin)

// Register Pinia with the app (so stores are accessible everywhere)
app.use(pinia)
// Register the router with the app (so navigation and routes work)
app.use(router)

// Mount the app into the div#app element found in index.html
app.mount('#app')