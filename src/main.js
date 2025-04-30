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
//client id: qomKD7PNWccewSfT23671781029990919
//client secret: 2adfa2f8-59b5-4df9-9d67-8b323d18c812