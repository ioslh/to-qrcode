import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './app.vue'
import routes from './routes'
import './styles/global.scss'

createApp(App)
  .use(routes)
  .use(ElementPlus)
  .mount('#app')
