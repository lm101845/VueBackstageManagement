<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图-->
    <el-card class="box-card">
      <!--    搜索与添加-->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" @clear="getUserList" placeholder="请输入内容" class="input-with-select"
                    clearable>
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible = true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!--    用户列表区域-->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="ID" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="slotProp">
            <el-switch v-model="slotProp.row.mg_state" @change="userActiveChange(slotProp.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template v-slot="slotProp">
            <el-button @click="editDialog(slotProp.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="removeUser(slotProp.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button @click="setRole(slotProp.row)" type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
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

      <!--      添加用户对话框-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClosed" width="50%">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!--      修改用户对话框-->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%">
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px" class="demo-ruleForm">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!--      分配角色对话框-->
      <el-dialog title="分配角色" :visible.sync="setDialogVisible" width="50%" @close="setDialogClose">
        <div>
          <p>当前的用户：{{ userInfo.username }}</p>
          <p>当前的角色：{{ userInfo.role_name }}</p>
          <p>分配新角色：
            <el-select v-model="selectRoleId" placeholder="请选择">
              <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    const checkMobile = (rule, value, callback) => {
      // 验证手机号
      let regMobile = /^1[0-9]{10}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        return callback(new Error('请输入合法的手机号'))
      }
    }
    return {
      // 获取用户列表参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 添加用户对话框默认是否显示
      addDialogVisible: false,
      // 修改用户对话框默认是否显示
      editDialogVisible: false,
      // 添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户信息表单
      editForm: {},
      //添加用户表单规则验证
      addFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: ['blur', 'change']},
          {min: 3, max: 10, message: '用户名长度为3到10位', trigger: ['blur', 'change']}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: ['blur', 'change']},
          {min: 6, max: 15, message: '密码长度为6到15位', trigger: ['blur', 'change']}
        ],
        email: [
          {required: true, message: '请输入邮箱号', trigger: ['blur', 'change']},
          {type: 'email', message: '请输入正确的邮箱号', trigger: ['blur', 'change']}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: ['blur', 'change']},
          {validator: checkMobile, trigger: ['blur', 'change']}
        ]
      },
      // 分配角色对话框默认是否显示
      setDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList:'',
      // 选中的新角色id
      selectRoleId:'',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      // 获取用户列表
      this.$http.get('users', {params: this.queryInfo}).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          // this.$message.success(result.message)
          this.userlist = result.data.users
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
    handleSizeChange(newSize) {
      // 改变分页尺寸
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      // 改变分页页数
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    userActiveChange(userinfo) {
      // 修改用户状态
      this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
        } else {
          this.$message.error('修改失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    },
    addDialogClosed() {
      // 对话框关闭事件
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      // 点击确定添加用户，预校验
      this.$refs.addFormRef.validate(valid => {
        console.log(valid)
        if (valid) {
          let params = new URLSearchParams()
          params.append("username", this.addForm.username)
          params.append("password", this.addForm.password)
          params.append("email", this.addForm.email)
          params.append("mobile", this.addForm.mobile)
          this.$http.post('users', params).then(response => {
            console.log(response);//请求正确时执行的代码
            let result = response.data
            if (result.meta.status === 201) {
              this.$message.success(result.meta.msg)
              this.addDialogVisible = false
              // 隐藏添加用户对话框
              this.getUserList()
              // 重新获取用户列表
            } else {
              this.$message.error('添加用户失败！')
            }
          }).catch(response => {
            //发生错误时执行的代码
            this.$message.warning('服务器错误！')
            console.log(response)
          });
        }
      })
    },
    // 用户编辑对话框
    editDialog(id) {
      // console.log(id)
      this.editDialogVisible = true
      this.$http.get('users/' + id).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.editForm = result.data
        } else {
          this.$message.error('查询信息失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    },
    editUserInfo() {
      // 修改用户信息并提交
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }).then(response => {
            console.log(response);//请求正确时执行的代码
            let result = response.data
            if (result.meta.status === 200) {
              this.$message.success(result.meta.msg)
              this.editDialogVisible = false
              this.getUserList()
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
    removeUser(id) {
      // 删除用户
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('users/' + id).then(response => {
          console.log(response);//请求正确时执行的代码
          let result = response.data
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '删除用户成功!'
            });
            this.getUserList()
          } else {
            this.$message.error('删除用户失败！')
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
    // 分配角色对话框
    setRole(userInfo) {
      // 获取所有的角色列表
      this.$http.get('roles').then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.rolesList = result.data
        } else {
          this.$message.error('获取角色列表失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
      this.userInfo = userInfo
      this.setDialogVisible = true
    },
    //点击按钮分配角色
    saveRoleInfo(){
      if(!this.selectRoleId){
        return this.$message.error("请选择要分配的角色！")
      }
      console.log(this.userInfo)
      console.log(this.rolesList)
      this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoleId}).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.getUserList()
          this.setDialogVisible = false
        } else {
          this.$message.error('修改失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    },
    // 关闭分配权限对话框
    setDialogClose(){
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>
