<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图-->
    <el-card class="box-card">
      <!--    搜索-->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" @clear="getOrdersList" placeholder="请输入内容" class="input-with-select"
                    clearable>
            <el-button @click="getOrdersList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--          订单列表区域-->
      <el-table :data="orderlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="ID" align="center"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" align="center" width="220px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" align="center"></el-table-column>
        <el-table-column label="是否付款" align="center">
          <template v-slot="slotProp">
            <el-tag v-if="slotProp.row.pay_status ==='1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" align="center">
          <template v-slot="slotProp">
            <el-tag v-if="slotProp.row.is_send ==='是'" type="success">已发货</el-tag>
            <el-tag v-else type="danger">未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center" width="200px">
          <template v-slot="slotProp">
            {{ slotProp.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template v-slot="slotProp">
            <el-button @click="editDialog(slotProp.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="showProgress(slotProp.row.id)" type="success" icon="el-icon-location"
                       size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page=this.queryInfo.pagenum
          :page-sizes="[5, 10, 20]"
          :page-size=queryInfo.pagesize
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!--      修改地址对话框-->
    <el-dialog title="修改收货地址" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
              size="large"
              clearable
              :options="options"
              v-model="editForm.address1"
              @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editOrderClosed" >取 消</el-button>
          <el-button type="primary" @click="editOrder">确 定</el-button>
        </span>
    </el-dialog>
    <!--      查看物流信息对话框-->
    <el-dialog title="物流进度" :visible.sync="showDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 省市区三级联动
import { regionData } from 'element-china-area-data'

export default {
  name: "Order",
  data() {
    return {
      selectedOptions: [],
      // 获取订单列表参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 订单信息列表
      orderlist: [],
      total: 0,
      // 修改地址对话框默认隐藏
      editDialogVisible:false,
      // 修改地址表单对象
      editForm:{
        address1:'',
        address2:''
      },
      // 表单验证规则
      FormRules:{
        address1: [
          {required: true, message: '请选择省市区/县', trigger: "change"},
        ],
        address2: [
          {required: true, message: '请输入详细地址', trigger: ['blur', 'change']},
        ],
      },
      // 省市区级联选择配置
      options: regionData,
      // 物流进程查看对话框
      showDialogVisible:false,
      // 物流信息数据
      progressInfo:[]
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    getOrdersList() {
      this.$http.get('orders', {params: this.queryInfo}).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          // this.$message.success(result.message)
          this.orderlist = result.data.goods
          this.total = result.data.total
        } else {
          this.$message.error('获取列表失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    },
    // 改变分页尺寸
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 改变分页页数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 修改地址对话框
    editDialog() {
      this.editDialogVisible = true
    },
    // 查看物流状态对话框
    showProgress() {
      this.showDialogVisible = true
      // this.$http.get('/kuaidi/1106975712662').then(response => {
      //   console.log(response);//请求正确时执行的代码
      //   let result = response.data
      //   if (result.meta.status === 200) {
      //     this.$message.success(result.meta.msg)
      //     this.progressInfo = result.data.data
      //   } else {
      //     this.$message.error('获取物流信息失败！')
      //   }
      // }).catch(response => {
      //   //发生错误时执行的代码
      //   this.$message.warning('服务器错误！')
      //   console.log(response)
      // });
      this.$message.success("获取物流信息成功！")
      this.progressInfo =[
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ]
    },
    // 修改地址表单提交
    editOrder(){

    },
    // 级联选择器切换事件
    handleChange (value) {
      console.log(value)
    },
    // 修改地址对话框关闭事件
    editOrderClosed(){
      this.editDialogVisible =false
      this.$refs.editFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
