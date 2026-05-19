import { createApp } from 'vue'
import App from './app.vue'
import routes from './routes'
import './styles/global.scss'

const app = createApp(App)
app.use(routes).mount('#app')
