import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './plugins/element'
import axios from "axios";
// 全局样式文件
import './assets/css/global.less'
// 字体图标文件
// import '@fortawesome/fontawesome-free/css/all.css'
//markdown编辑器
import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// 导入Nprogress加载效果插件
import Nprogress from 'nprogress'
// import 'nprogress/nprogress.css'

// 请求根路径
axios.defaults.baseURL = "/api/private/v1/"
// 在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  Nprogress.start()
  return config
})
// 请求时头部携带token认证信息
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
// 在response拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
axios.timeout = 1000 * 10
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(mavonEditor)
// 自定义时间过滤器
Vue.filter('dateFormat', function (dateStr, pattern = '') {
  // 根据给定的时间字符串， 得到特定的时间
  let dt = new Date(dateStr*1000)
  let y = dt.getFullYear()
  let m = (dt.getMonth() + 1).toString().padStart(2, '0')
  let d = dt.getDate().toString().padStart(2, '0')
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
    return `${y}-${m}-${d}`
  } else {
    let hh = dt.getHours().toString().padStart(2, '0')
    let mm = dt.getMinutes().toString().padStart(2, '0')
    let ss = dt.getSeconds().toString().padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
