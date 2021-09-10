<!--商品列表页面-->
<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图区域-->
    <el-card class="box-card">
      <!--    搜索与添加-->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" @clear="getGoodsList" placeholder="请输入内容" clearable>
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addGoodsPage" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!--    用户列表区域-->
      <el-table :data="goodslist" style="width: 100%" border stripe>
        <el-table-column type="index" label="ID" align="center"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" align="center" width="110px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" align="center" width="85px"></el-table-column>
        <el-table-column label="商品创建时间" align="center" width="105px">
          <template v-slot="slotProp">
            {{ slotProp.row.add_time | dateFormat() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template v-slot="slotProp">
            <el-button @click="editDialog(slotProp.row.goods_id)" type="primary" icon="el-icon-edit" size="mini">编辑
            </el-button>
            <el-button @click="removeGoods(slotProp.row.goods_id)" type="danger" icon="el-icon-delete" size="mini">删除
            </el-button>
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
          :total="total" background>
      </el-pagination>
    </el-card>
    <!--      修改商品信息对话框-->
    <el-dialog title="修改商品信息" :visible.sync="editDialogVisible" width="75%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍">
          <mavon-editor v-model="editForm.goods_introduce" :toolbars="toolbars" style="min-height:300px"/>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
              :headers="headerObj"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="动态参数">
        </el-form-item>
        <el-form-item v-for="item in manyTableData" :key="item.index" :label="item.attr_name" label-width="150px">
          <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox v-for="(cb,i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="静态属性">
        </el-form-item>
        <el-form-item v-for="item in onlyTableData" :key="item.index" :label="item.attr_name" label-width="230px">
          <el-input v-model="item.attr_value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from "axios";

export default {
  name: "list",
  data() {
    const checkParameter = (rule, value, callback) => {
      // 验证表单项数字值大于0
      if (value > 0) {
        return callback()
      } else {
        return callback(new Error('请输入大于0的参数值'))
      }
    }
    return {
      // 获取商品列表参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0,
      // 修改商品对话框默认状态
      editDialogVisible: false,
      // 修改商品信息表单内容
      editForm: {},
      // 修改商品表单验证规则
      editFormRules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: ['blur', 'change']},
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: ['blur', 'change']},
          {validator: checkParameter, trigger: ['blur', 'change']}
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: ['blur', 'change']},
          {validator: checkParameter, trigger: ['blur', 'change']}
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: ['blur', 'change']},
          {validator: checkParameter, trigger: ['blur', 'change']}
        ],
      },
      // markdown配置
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true // 导航目录
      },
      // 商品图片文件列表
      fileList: [],
      // 商品图片预览窗口默认关闭
      previewVisible: false,
      // 图片上传接口地址
      uploadUrl: axios.defaults.baseURL + 'upload',
      // 图片上传组件请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片地址
      previewPath: '',
      // 商品动态参数列表
      manyTableData: [],
      // 商品静态属性列表
      onlyTableData: [],
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取商品列表
    getGoodsList() {
      this.$http.get('goods', {params: this.queryInfo}).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.goodslist = result.data.goods
          this.total = result.data.total
        } else {
          this.$message.error('获取商品列表失败！')
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
      this.getGoodsList()
    },
    // 改变分页页数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    removeGoods(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('goods/' + id).then(response => {
          console.log(response);//请求正确时执行的代码
          let result = response.data
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: result.meta.msg
            });
            this.getGoodsList()
          } else {
            this.$message.error('删除商品失败！')
          }
        }).catch(response => {
          //发生错误时执行的代码
          this.$message.warning('服务器错误！')
          console.log(response)
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 跳转到添加商品页
    addGoodsPage() {
      this.$router.push('/goods/add')
    },
    // 编辑商品信息对话框弹出
    editDialog(id) {
      this.editDialogVisible = true
      this.$http.get('goods/' + id).then(response => {
        console.log(response);//请求正确时执行的代码
        this.manyTableData=[]
        this.onlyTableData=[]
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.fileList = []
          result.data.pics.forEach(item => {
            const imgInfo = {
              name: item.pics_big.split("/")[3],
              url: item.pics_big_url
            }
            this.fileList.push(imgInfo)
          })
          result.data.attrs.forEach(item => {
            item.attr_vals = item.attr_vals.split(',')
            if (item.attr_sel === 'many') {
              this.manyTableData.push(item)
            } else {
              this.onlyTableData.push(item)
            }
          })
          this.editForm = result.data
          this.editForm.attrs = []
        } else {
          this.$message.error('获取商品信息失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    },
    // 编辑商品信息提交
    editGoodsInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          // 构造满足要求的新表单数据格式(深拷贝原addForm)
          const form = _.cloneDeep(this.editForm)
          this.manyTableData.forEach(item => {
            // console.log(item)
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            }
            form.attrs.push(newInfo)
          })
          this.onlyTableData.forEach(item => {
            // console.log(item)
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            form.attrs.push(newInfo)
          })
          this.editForm.pics.forEach(item => {
            console.log(item)
          })
          console.log(form)
          this.$http.put(`goods/${form.goods_id}`, form).then(response => {
            console.log(response);//请求正确时执行的代码
            let result = response.data
            if (result.meta.status === 200) {
              this.$message.success(result.meta.msg)
              this.getGoodsList()
              this.editDialogVisible = false
            } else if (result.meta.status === 400) {
              this.$message.error(result.meta.msg)
            } else {
              this.$message.error('修改商品信息失败！')
            }
          }).catch(response => {
            //发生错误时执行的代码
            this.$message.warning('服务器错误！')
            console.log(response)
          });
        } else {
          return this.$message.error("请检查表单项填写内容")
        }
      })
    },
    // 图片上传完成后预览
    handlePreview(file) {
      this.previewPath = file.url
      this.previewVisible = true
    },
    // 图片上传完成后移除
    handleRemove(file) {
      console.log(file)
      // const filePath = file.response.data.tmp_path
      const i = this.editForm.pics.findIndex(x => x.pic === file.name)
      this.editForm.pics.splice(i, 1)
    },
    // 图片上传成功事件
    handleSuccess(response) {
      console.log(response);//请求正确时执行的代码
      let result = response
      if (result.meta.status === 200) {
        this.$message.success(result.meta.msg)
        const picsInfo = {pic: result.data.tmp_path}
        this.editForm.pics.push(picsInfo)
      } else {
        this.$message.error('图片上传失败！')
      }
    },
  }
}
</script>

<style lang="less" scoped>
.previewImg {
  width: 100%;
}

.el-checkbox {
  margin: 0 15px 15px 0 !important;
}
</style>
