/*
 * @Description: main
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:34:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-10 23:06:36
 * @FilePath: \vite-admin-vue\src\main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'

// 挂载路由
import { setupRouter } from './router'
import store from './store'


async function setupWebApp(){
    const app = createApp(App)

    await setupRouter(app)
    app.use(store)
    app.mount('#app')
}

setupWebApp()

