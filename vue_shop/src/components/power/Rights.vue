<template>
  <div>
    <!-- <h3>权限列表组件页面</h3> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <!-- 点击首页会回到home中 -->
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <el-table :data="rightsList" border>
            <!-- table要指定数据源，通过:data绑定数据源 -->
            <el-table-column type="index"></el-table-column>
            <!-- 创建索引列 -->
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <!-- 标题通过label属性来指定 -->
            <el-table-column label="路径" prop="path"></el-table-column>
            <!-- 权限名称之后是路径这一列 -->
            <el-table-column label="权限登记" prop="level">
                <!-- 我们在这里要通过作用域插槽的形式来自定义它的输出格式 -->
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
            <!-- 路径列以后是权限等级这一列 -->
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return {
            // 所有的权限列表
            rightsList:[]
        }
    },
    created(){
        // 获取所有的权限
        this.getRightsList()
    },
    methods:{
        // 获取权限列表
        async getRightsList(){
            const {data:res} = await this.$http.get('rights/list')
            if(res.meta.status !== 200){
                return this.$message.error('获取权限列表失败！')
            }
            this.rightsList = res.data
            // console.log(this.rightsList);
        }
    }
}
</script>
<style lang="less" scoped></style>
