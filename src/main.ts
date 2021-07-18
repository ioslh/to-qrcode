import { createApp } from 'vue'
import {
  ElSelect,
  ElOption,
  ElButton,
  ElButtonGroup,
  ElTooltip,
  ElInput,
  ElInputNumber,
  ElDialog,
  ElPopconfirm,

  ElMessage,
  ElLoading
} from 'element-plus'
import App from './app.vue'
import routes from './routes'
import 'element-plus/packages/theme-chalk/src/base.scss'
import './styles/global.scss'

const app = createApp(App)

;[
  ElSelect,
  ElOption,
  ElInputNumber,
  ElButton,
  ElButtonGroup,
  ElTooltip,
  ElInput,
  ElDialog,
  ElPopconfirm,
].forEach(component => {
  app.component(component.name, component)
})

;[
  ElLoading,
  ElMessage,
].forEach(plugin => {
  app.use(plugin)
})

app.use(routes).mount('#app')
