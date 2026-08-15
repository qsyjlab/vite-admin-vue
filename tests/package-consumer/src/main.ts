import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@framebase/element-plus-theme/style.css'
import '@framebase/element-plus-pro-components/style.css'
import App from './App.vue'

createApp(App).use(ElementPlus).mount('#app')
