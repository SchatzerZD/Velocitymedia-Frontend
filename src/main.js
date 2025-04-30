import "./assets/main.css"


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

//api key fiken: 8840530608.uzR6d9qkcavB6mPiqSgRnu2UQKVVh2so