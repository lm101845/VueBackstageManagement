<!--分类参数页面-->
<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--提示内容-->
      <el-alert
          title="注意：只允许为第三级分类设置相关参数"
          type="warning" :closable="false" show-icon>
      </el-alert>
      <!--      选择商品分类-->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
              v-model="selectKeys"
              :options="catelist"
              clearable
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
              @change="parentCateChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" @click="addDialogVisible=true" :disabled="isBtnDisabled">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand" align="center">
              <template v-slot="slotProp">
                <el-tag v-for="(item,i) in slotProp.row.attr_vals" :key="i" @close="handleClose(i,slotProp.row)" closable>{{ item }}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="slotProp.row.inputVisible"
                    v-model="slotProp.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(slotProp.row)"
                    @blur="handleInputConfirm(slotProp.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(slotProp.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="ID" type="index" align="center"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name" align="center"></el-table-column>
            <el-table-column
                label="操作" sortable width="250" align="center">
              <template v-slot="slotProp">
                <el-button @click="editDialog(slotProp.row.attr_id)" type="primary" icon="el-icon-edit" size="mini">编辑
                </el-button>
                <el-button @click="removeParams(slotProp.row.attr_id)" type="danger" icon="el-icon-delete" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" @click="addDialogVisible=true" :disabled="isBtnDisabled">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand" align="center">
              <template v-slot="slotProp">
                <el-tag v-for="(item,i) in slotProp.row.attr_vals" :key="i" @close="handleClose(i,slotProp.row)" closable>{{ item }}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="slotProp.row.inputVisible"
                    v-model="slotProp.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(slotProp.row)"
                    @blur="handleInputConfirm(slotProp.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(slotProp.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="ID" type="index" align="center"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name" align="center"></el-table-column>
            <el-table-column
                label="操作" sortable width="250" align="center">
              <template v-slot="slotProp">
                <el-button @click="editDialog(slotProp.row.attr_id)" type="primary" icon="el-icon-edit" size="mini">编辑
                </el-button>
                <el-button @click="removeParams(slotProp.row.attr_id)" type="danger" icon="el-icon-delete" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--  添加参数的对话框-->
    <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogClose">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>
    <!--  修改参数的对话框-->
    <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogClose">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 商品分类列表
      catelist: [],
      // 级联选中的数组
      selectKeys: [],
      // 被激活页签名称
      activeName: 'many',
      // 动态表格数据
      manyTableData: [],
      // 静态参数表格数据
      onlyTableData: [],
      // 添加参数对话框默认状态
      addDialogVisible: false,
      // 添加参数表单
      addForm: {},
      // 添加参数表单验证规则
      addFormRules: {
        attr_name: [
          {required: true, message: '请输入参数名称', trigger: ['blur', 'change']},
        ]
      },
      // 修改参数对话框默认显示状态
      editDialogVisible: false,
      // 修改参数对话框表单
      editForm: {},
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品参数
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
    // 获取参数的列表数据
    getParamsDate() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.manyTableData = []
        this.onlyTableData = []
      } else {
        this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}}).then(response => {
          console.log(response);//请求正确时执行的代码
          let result = response.data
          if (result.meta.status === 200) {
            this.$message.success(result.meta.msg)
            // 获取商品tag参数列表
            result.data.forEach(item => {
              if (item.attr_vals.length === 0) {
                item.attr_vals = []
              } else {
                item.attr_vals = item.attr_vals.split(',')
              }
              // tag文本框输入与隐藏
              item.inputVisible = false
              // tag文本输入框值
              item.inputValue = ''
            })
            if (this.activeName === 'many') {
              this.manyTableData = result.data
            } else {
              this.onlyTableData = result.data
            }
          } else {
            this.$message.error('获取权限列表数据异常！')
          }
        }).catch(response => {
          //发生错误时执行的代码
          this.$message.warning('服务器错误！')
          console.log(response)
        });
      }
    },
    // 级联选择框数据改变
    parentCateChange() {
      this.getParamsDate()
    },
    // 页签点击事件处理
    handleTabClick() {
      this.getParamsDate()
    },
    // 添加对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
      this.addDialogVisible = false
    },
    // 添加对话框确定按钮事件
    addParams() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          this.$http.post(`categories/${this.cateId}/attributes`, {
                attr_name: this.addForm.attr_name,
                attr_sel: this.activeName
              }
          ).then(response => {
            console.log(response);//请求正确时执行的代码
            let result = response.data
            if (result.meta.status === 201) {
              this.$message.success(result.meta.msg)
              this.addDialogVisible = false
              // 隐藏添加分类对话框
              this.getParamsDate()
              // 重新获取分类列表
            } else {
              this.$message.error('添加参数失败！')
            }
          }).catch(response => {
            //发生错误时执行的代码
            this.$message.warning('服务器错误！')
            console.log(response)
          });
        }
      })
    },
    // 修改参数对话框
    editDialog(id) {
      this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: {attr_sel: this.activeName}
      }).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.editForm = result.data
        } else {
          this.$message.error('查询分类信息失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
      this.editDialogVisible = true
    },
    // 关闭修改参数对话框
    editDialogClose() {
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
    },
    // 修改参数对话框确定提交
    editParams() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }).then(response => {
            console.log(response);//请求正确时执行的代码
            let result = response.data
            if (result.meta.status === 200) {
              this.$message.success(result.meta.msg)
              this.editDialogVisible = false
              this.getParamsDate()
            } else {
              this.$message.error('修改失败！')
            }
          }).catch(response => {
            //发生错误时执行的代码
            this.$message.warning('服务器错误！')
            console.log(response)
          });
        }
      })
    },
    // 删除参数对话框
    removeParams(id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${this.cateId}/attributes/${id}`).then(response => {
          console.log(response);//请求正确时执行的代码
          let result = response.data
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: result.meta.msg
            });
            this.getParamsDate()
          } else {
            this.$message.error('删除参数失败！')
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
    // tag点击切换为输入状态
    showInput(row) {
      row.inputVisible = true
      // 文本自动获取焦点
      // $nextTick(页面重新渲染时，执行函数中的代码)
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // tag输入完成事件
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // tag删除事件
    handleClose(id,row){
      row.attr_vals.splice(id,1)
      this.saveAttrVals(row)
    },
    // tag标签修改上传
    saveAttrVals(row){
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      }).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.editDialogVisible = false
          this.getCateList()
        } else {
          this.$message.error('修改失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    }
  },
  computed: {
    // 如果男需要禁用，返回true，否则返回false
    isBtnDisabled() {
      if (this.selectKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 当前选中的三级分类的ID
    cateId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      } else {
        return null
      }
    },
    // 对话框标题
    titleText() {
      if (this.activeName === 'many') {
        return "动态参数"
      } else {
        return "静态属性"
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  padding: 25px 0;
}
.input-new-tag{
  width: 150px!important;
}
</style>
