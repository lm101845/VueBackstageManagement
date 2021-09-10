<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图-->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column label="ID" type="index" align="center"></el-table-column>
        <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
        <el-table-column label="路径" prop="path" align="center"></el-table-column>
        <el-table-column label="权限等级" align="center">
          <template v-slot="slotProp">
            <el-tag v-if="slotProp.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="slotProp.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      //权限列表
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    getRightsList(){
      this.$http.get('rights/list').then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status === 200) {
          // this.$message.success(result.message)
          this.rightsList = result.data
          // console.log(this.menulist)
        } else {
          this.$message.error('获取权限列表数据异常！')
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

</style>
