<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button @click="addDialogVisible = true" type="primary">添加角色</el-button>
      <el-table :data="rolelist" style="width: 100%" border stripe>
        <!--        展开列-->
        <el-table-column type="expand">
          <template v-slot="slotProp">
            <!--            一级权限-->
            <el-row v-for="(item1) in slotProp.row.children" :key="item1.id" class="border1 vcenter">
              <el-col :span="6">
                <el-tag closable @close="removeRoles(slotProp.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <!--              二级权限-->
                <el-row v-for="(item2) in item1.children" :key="item2.id" class="border2 vcenter">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRoles(slotProp.row,item2.id)">{{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable
                            @close="removeRoles(slotProp.row,item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="ID" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center"></el-table-column>
        <el-table-column label="操作" width="350px" align="center">
          <template v-slot="slotProp">
            <el-button @click="editDialog(slotProp.row.id)" type="primary" icon="el-icon-edit" size="mini">编辑
            </el-button>
            <el-button @click="removeUser(slotProp.row.id)" type="danger" icon="el-icon-delete" size="mini">删除
            </el-button>
            <el-button @click="setRight(slotProp.row)" type="warning" icon="el-icon-setting" size="mini">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--      添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" @close="addDialogClosed" width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    <!--      修改角色对话框-->
    <el-dialog title="修改角色信息" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRileInfo">确 定</el-button>
        </span>
    </el-dialog>
    <!--      分配角色权限对话框-->
    <el-dialog title="分配角色权限权限" @close="setRightDialogClosed" :visible.sync="setDialogVisible" width="50%">
      <el-tree :data="rightslist" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys"></el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 角色列表数据
      rolelist: [],
      // 添加角色对话框默认是否显示
      addDialogVisible: false,
      // 添加角色表单
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      //添加角色表单规则验证
      addFormRules: {
        roleName: [
          {required: true, message: '请输入角色名', trigger: ['blur', 'change']}
        ]
      },
      // 修改角色对话框默认是否显示
      editDialogVisible: false,
      //编辑角色表单
      editForm: {},
      // 分配角色权限对话框默认是否显示
      setDialogVisible: false,
      // 所有权限数据
      rightslist: [],
      // 树形组件属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id数组
      defkeys:[],
      // 当前分配权限的角色id
      roleId:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    getRolesList() {
      this.$http.get('roles').then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          // this.$message.success(result.message)
          this.rolelist = result.data
          // console.log(this.menulist)
        } else {
          this.$message.error('获取权限列表数据异常！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    },
    // 添加角色表单提交
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        console.log(valid)
        if (valid) {
          this.$http.post('roles', this.addForm).then(response => {
            console.log(response);//请求正确时执行的代码
            let result = response.data
            if (result.meta.status === 201) {
              this.$message.success(result.meta.msg)
              // 隐藏添加用户对话框
              this.addDialogVisible = false
              // 重新获取用户列表
              this.getRolesList()
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
      this.addDialogVisible = false
    },
    // 关闭添加角色表单，清空数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 查询用户角色信息
    editDialog(id) {
      this.editDialogVisible = true
      this.$http.get('roles/' + id).then(response => {
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
    // 修改角色表单提交
    editRileInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.$http.put('roles/' + this.editForm.roleId, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }).then(response => {
            console.log(response);//请求正确时执行的代码
            let result = response.data
            if (result.meta.status === 200) {
              this.$message.success(result.meta.msg)
              this.editDialogVisible = false
              this.getRolesList()
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
    // 删除角色
    removeUser(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('roles/' + id).then(response => {
          console.log(response);//请求正确时执行的代码
          let result = response.data
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: result.meta.msg
            });
            this.getRolesList()
          } else {
            this.$message.error('删除角色失败！')
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
    // 删除角色的权限
    removeRoles(role, right_id) {
      this.$confirm('此操作将永久删除该角色的权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('roles/' + role.id + '/rights/' + right_id).then(response => {
          console.log(response);//请求正确时执行的代码
          let result = response.data
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: result.meta.msg
            });
            role.children = result.data
          } else {
            this.$message.error('删除角色权限失败！')
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
    // 分配角色权限权限对话框
    setRight(role) {
      this.roleId = role.id
      // 获取已有的权限
      this.getLeafKeys(role,this.defkeys)
      this.setDialogVisible = true
      // 获取权限列表树
      this.$http.get('rights/tree').then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          this.rightslist = result.data
        } else {
          this.$message.error('查询信息失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    },
    // 通过递归获取已有的三级权限id
    getLeafKeys(node,arr){
      if (!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item,arr))
    },
    // 关闭分配角色权限对话框
    setRightDialogClosed(){
      this.defkeys = []
    },
    // 角色分配权限确定提交
    allotRights(){
      const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      this.$http.post(`roles/${this.roleId}/rights`, {rids:idStr}).then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          this.$message.success(result.meta.msg)
          // 隐藏添加用户对话框
          this.setDialogVisible = false
          // 重新获取用户列表
          this.getRolesList()
        } else {
          this.$message.error('更新权限信息失败！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px
}

.el-table__expanded-cell .border1:first-child {
  border-top: 1px solid #eeeeee;
}

.el-col-18 .border2:last-child {
  border-bottom: none;
}

.border1, .border2 {
  border-bottom: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
