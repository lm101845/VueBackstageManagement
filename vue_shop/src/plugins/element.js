import Vue from 'vue'
// import { Button } from 'element-ui'
// import {Form,FormItem} from 'element-ui'
// import {Input} from 'element-ui'
// // 导入弹框提示组件
// import {Message} from 'element-ui'

import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  Upload
} from 'element-ui'

import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)

Vue.use(Timeline)
Vue.use(TimelineItem)

// MessageBox比较特殊，不需要使用Vue.use函数
Vue.prototype.$message = Message
// message和button.form，input这些都不一样，它需要进行全局挂载
// 这个代表把弹框组件挂载到了Vue的原型对象上
Vue.prototype.$confirm = MessageBox.confirm
