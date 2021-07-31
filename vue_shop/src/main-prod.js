import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'

// 在入口文件中导入全局样式表
import './assets/css/global.css'

// 在入口文件中导入字体图标
import './assets/fonts/iconfont.css'

import TreeTable from  'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器对应的样式
// 我们把样式表到时候放到public/index.html中去
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入NProgress包对应的JS和CSS
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// 导入axios这个包
import axios from 'axios'
// 为axios设置一下请求的根路径
// 我觉得最好不要在这里写，在这里写就有点乱了，最好封装一下
// 配置请求的根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1'

// 在request拦截器中，展示进度条NProgress.start()

// 给axios设置拦截器
axios.interceptors.request.use(config=>{
  // 这个config就是请求对象
  // 在这个请求对象身上会包含N多的属性
  // console.log(config);
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须要return这个config，这个是固定写法
  return config
})

// 在response拦截器中隐藏进度条  NProgress.done()
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})
// 接下来把这个包挂载到Vue的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)
  // 第一个参数是过滤器的名字
// 第二个参数是过滤器的处理函数,给它一个形参
// 这个形参是它需要处理的时间的数据
// 然后再来new 一个Date
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  // 这个month是从0开始的，需要让它加1
  // 月份如果不足2位，前面加一个0，使用padStart函数来做

  const hh =( dt.getHours() + '').padStart(2,'0')
  const mm =( dt.getMinutes() + '').padStart(2,'0')
  const ss =( dt.getSeconds() + '').padStart(2,'0')

  // return `yyyy-mm-dd hh:mm:ss`
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
