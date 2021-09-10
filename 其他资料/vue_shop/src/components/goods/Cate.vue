<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--添加分类-->
      <el-row>
        <el-col>
          <el-button @click="showAddCateDialog()" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!--    分类列表区域-->
      <el-table
          :data="catalist"
          row-key="cat_id"
          border
          lazy
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
            type="index" label="ID" sortable align="center">
        </el-table-column>
        <el-table-column
            prop="cat_name" label="分类名称" sortable align="center">
        </el-table-column>
        <el-table-column
            label="是否有效" sortable align="center">
          <template v-slot="slotProp">
            <i class="el-icon-success" v-if="slotProp.row.cat_deleted === false"></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
            label="排序" sortable align="center">
          <template v-slot="slotProp">
            <el-tag size="mini" v-if="slotProp.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="slotProp.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作" sortable width="250" align="center">
          <template v-slot="slotProp">
            <el-button @click="editDialog(slotProp.row.cat_id)" type="primary" icon="el-icon-edit" size="mini">编辑
            </el-button>
            <el-button @click="removeCate(slotProp.row.cat_id)" type="danger" icon="el-icon-delete" size="mini">删除
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
          :total="total">
      </el-pagination>

      <!--      添加分类对话框-->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" @close="addDialogClosed" width="50%">
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
                v-model="selectKeys"
                :options="parentCateList"
                clearable
                :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children',checkStrictly:'true' }"
                @change="parentCateChange"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
              </span>
      </el-dialog>
      <!--      修改分类对话框-->
      <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%">
        <el-form :model="editForm" :rules="addCateRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
              </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      // 商品分类列表
      catalist: [],
      // 数据条数
      total: 0,
      // 查询分类列表条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //添加用户对话框默认隐藏
      addDialogVisible: false,
      // 添加分类表单内容
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类表单验证规则
      addCateRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: ['blur', 'change']},
        ]
      },
      // 获取到的父级分类列表
      parentCateList: [],
      // 级联选择器选中的id
      selectKeys: [],
      // 修改商品分类表单
      editForm: {},
      // 修改分类表单默认隐藏
      editDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    getCateList() {
      // 获取商品列表
      this.$http.get('categories', {params: this.queryInfo}).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.catalist = result.data.result
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
    // pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // pagenum改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击弹出添加分类对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    // 获取父级分类数据列表
    getParentCateList() {
      this.$http.get('categories', {params: {type: 2}}).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.parentCateList = result.data
        } else {
          this.$message.error('获取列表失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    },
    // 选择项发生改变，触发函数
    parentCateChange() {
      // console.log(this.selectKeys)
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类对话框关闭事件
    addDialogClosed() {
      this.$refs.addCateRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectKeys = []
    },
    // 提交添加分类表单
    addCate() {
      this.$refs.addCateRef.validate(valid => {
        if (valid) {
          this.$http.post('categories', this.addCateForm).then(response => {
            console.log(response);//请求正确时执行的代码
            let result = response.data
            if (result.meta.status === 201) {
              this.$message.success(result.meta.msg)
              this.addDialogVisible = false
              // 隐藏添加分类对话框
              this.getCateList()
              // 重新获取分类列表
            } else {
              this.$message.error('添加分类失败！')
            }
          }).catch(response => {
            //发生错误时执行的代码
            this.$message.warning('服务器错误！')
            console.log(response)
          });
        }
      })
    },
    // 修改分类对话框
    editDialog(id) {
      this.editDialogVisible = true
      this.$http.get('categories/' + id).then(response => {
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
    },
    // 提交修改分类表单
    editCate() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.$http.put('categories/' + this.editForm.cat_id, {
            cat_name: this.editForm.cat_name,
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
      })
    },
    // 删除分类
    removeCate(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('categories/' + id).then(response => {
          console.log(response);//请求正确时执行的代码
          let result = response.data
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: result.meta.msg
            });
            this.getCateList()
          } else {
            this.$message.error('删除分类失败！')
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
    }
  }
}
</script>

<style lang="less" scoped>
.el-icon-success {
  color: lightgreen;
}

.el-icon-error {
  color: red;
}
.el-cascader {
  width: 100%;
}
</style>
