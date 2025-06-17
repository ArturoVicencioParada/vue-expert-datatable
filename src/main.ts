import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import VueExpertDatatablePlugin from './index'

const app = createApp(App)
VueExpertDatatablePlugin(app, {
    lang: 'ES',
    theme: 'vue-expert-datatable'
})
app.mount('#app')
