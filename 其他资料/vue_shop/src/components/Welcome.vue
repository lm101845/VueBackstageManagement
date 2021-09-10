<template>
  <div>
    <el-card>
      <div class="flex-box">
        <span>Welcome</span>
        <span>欢迎登录商城后台管理系统</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Welcome"
}
</script>

<style lang="less" scoped>
.flex-box {
  height: 500px;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flex-box span {
  flex: 1;
  font-size: 30px;
  color: #3498db;
}
</style>
