<!--添加商品页面-->
<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods'}">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--提示内容-->
      <el-alert
          title="添加商品信息"
          type="info" :closable="false" center show-icon>
      </el-alert>
      <!--      步骤条-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--    标签页-->
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="200px" label-position="top">
        <el-tabs @tab-click="tabClicked" tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                  v-model="addForm.goods_cat"
                  :options="catelist"
                  clearable
                  :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
                  @change="parentCateChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb,i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
                :headers="headerObj"
                :action="uploadUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <mavon-editor v-model="addForm.goods_introduce" :toolbars="toolbars" style="min-height:500px"/>
            <el-button @click="addGoods" type="primary" class="btnAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import _ from 'lodash'

export default {
  name: "Add",
  data() {
    return {
      // 默认激活的步骤索引
      activeIndex: 0,
      // 添加商品表单对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 图片上传完成获取的地址
        pics: [],
        // 商品内容富文本
        goods_introduce: '',
        // 商品参数
        attrs: []
      },
      // 表单验证规则
      rules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: ['blur', 'change']},
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: ['blur', 'change']},
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: ['blur', 'change']},
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: ['blur', 'change']},
        ],
        goods_cat: [
          {required: true, message: "请选择商品分类", trigger: "change"},
        ],
      },
      // 商品分类数据
      catelist: [],
      // tab切换表单检查
      tabCheck: true,
      // 动态参数列表数组
      manyTableData: [],
      // 静态属性列表数组
      onlyTableData: [],
      // 图片上传接口地址
      uploadUrl: axios.defaults.baseURL + 'upload',
      // 图片上传组件请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片上传完成后服务器保存的地址
      previewPath: '',
      // 图片预览对话框默认隐藏
      previewVisible: false,
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
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
// 获取所有商品分类数据
    getCateList() {
      this.$http.get('categories').then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.catelist = result.data
        } else {
          this.$message.error('获取商品分类失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    },
    // 级联选择器选中项变化
    parentCateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$message.error('请选择三级商品分类！')
      }
    },
    // 切换到下一个tab标签事件
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName,oldActiveName)
      if (oldActiveName === '0') {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) {
            this.$message.error('请填写表单内容！')
            this.tabCheck = false
          } else {
            this.tabCheck = true
          }
        })
        return this.tabCheck
      }
    },
    // tab被选中时触发事件
    tabClicked() {
      // 访问的是动态参数面板
      if (this.activeIndex === '1') {
        this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'many'}}).then(response => {
          console.log(response);//请求正确时执行的代码
          let result = response.data
          if (result.meta.status === 200) {
            this.$message.success(result.meta.msg)
            result.data.forEach(item => {
              if (item.attr_vals.length === 0) {
                item.attr_vals = []
              } else {
                item.attr_vals = item.attr_vals.split(',')
              }
            })
            this.manyTableData = result.data
          } else {
            this.$message.error('获取动态参数失败！')
          }
        }).catch(response => {
          //发生错误时执行的代码
          this.$message.warning('服务器错误！')
          console.log(response)
        });
      }
      // 访问的是静态属性参数面板
      else if (this.activeIndex === '2') {
        this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'only'}}).then(response => {
          console.log(response);//请求正确时执行的代码
          let result = response.data
          if (result.meta.status === 200) {
            this.$message.success(result.meta.msg)
            this.onlyTableData = result.data
          } else {
            this.$message.error('获取静态属性失败！')
          }
        }).catch(response => {
          //发生错误时执行的代码
          this.$message.warning('服务器错误！')
          console.log(response)
        });
      }
    },
    // 图片上传完成后预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 图片上传完成后移除
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 图片上传成功事件
    handleSuccess(response) {
      console.log(response);//请求正确时执行的代码
      let result = response
      if (result.meta.status === 200) {
        this.$message.success(result.meta.msg)
        const picsInfo = {pic: result.data.tmp_path}
        this.addForm.pics.push(picsInfo)
      } else {
        this.$message.error('图片上传失败！')
      }
    },
    // 添加商品按钮
    addGoods() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 构造满足要求的新表单数据格式(深拷贝原addForm)
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            }
            this.addForm.attrs.push(newInfo)
          })
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          console.log(form)
          this.$http.post('goods', form).then(response => {
            console.log(response);//请求正确时执行的代码
            let result = response.data
            if (result.meta.status === 201) {
              this.$message.success(result.meta.msg)
              this.$router.push('/goods')
            } else if(result.meta.status === 400){
              this.$message.error(result.meta.msg)
            }
            else {
              this.$message.error('添加商品失败！')
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
    }
  },
  computed: {
    // 获取选中的三级分类ID
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px;
}

.el-tabs {
  margin: 20px 0;
}

.el-cascader {
  width: 100%;
}

.el-checkbox {
  margin: 10px !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px
}

</style>
