import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from "@/components/Login"
// import Home from "@/components/Home";
// import Welcome from "@/components/Welcome";
// import Users from "@/components/user/Users";
// import Rights from "@/components/power/Rights";
// import Roles from "@/components/power/Roles";
// import Cate from "@/components/goods/Cate";
// import Params from "@/components/goods/Params";
// import GoodList from "@/components/goods/List"
// import GoodAdd from "@/components/goods/Add"
// import Order from "@/components/order/Order";
// import Report from "@/components/report/Report";
// import Home from '../views/Home.vue'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome')

const Users = () => import(/* webpackChunkName: "users" */ '@/components/user/Users')

const Rights = () => import(/* webpackChunkName: "power" */ '@/components/power/Rights')
const Roles = () => import(/* webpackChunkName: "power" */ '@/components/power/Roles')

const Cate = () => import(/* webpackChunkName: "goods" */ '@/components/goods/Cate')
const Params = () => import(/* webpackChunkName: "goods" */ '@/components/goods/Params')
const GoodList = () => import(/* webpackChunkName: "goods" */ '@/components/goods/List')
const GoodAdd = () => import(/* webpackChunkName: "goods" */ '@/components/goods/Add')

const Order = () => import(/* webpackChunkName: "order" */ '@/components/order/Order')

const Report = () => import(/* webpackChunkName: "report" */ '@/components/report/Report')

Vue.use(VueRouter)

const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {
    path: '/home', component: Home, redirect: '/welcome', children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: Users},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      {path: '/categories', component: Cate},
      {path: '/params', component: Params},
      {path: '/goods', component: GoodList},
      {path: '/goods/add', component: GoodAdd},
      {path: '/orders', component: Order},
      {path: '/reports',component: Report}
    ]
  },
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 访问的路径 from 从哪来 next 响应路径
  if (to.path === '/login') {
    return next()
  } else {
    const token = window.sessionStorage.getItem('token')
    if (token) {
      console.log(token)
      next()
    } else {
      next('/login')
    }
  }
})
export default router
