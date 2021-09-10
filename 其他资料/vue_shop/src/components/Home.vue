<template>
  <div class="home-div">
    <el-container>
      <!--      头部区域-->
      <el-header>
        <div>
          <img src="../assets/logo.png">
          <span>商城管理系统</span>
        </div>
        <el-button @click="logout" type="info">退出</el-button>
      </el-header>
      <el-container>
        <!--        侧边区域-->
        <el-aside :width="isCollaose ? '64px' : '200px'">
          <div @click="toggleCollapse" class="toggle-button">
            <i :class="isCollaose ? 'fas fa-outdent' : 'fas fa-indent'"></i>
          </div>
          <el-menu
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409BEF" :unique-opened="true" :collapse="isCollaose" :collapse-transition="false"
              :router="true" :default-active="routeActive">
            <el-submenu v-for="(item,index) in menulist" :key="item.id" :index="item.id+''">
              <template slot="title">
                <i :class="menuicon[index]"></i>
                <span>{{ item.authName }} </span>
              </template>
              <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/'+subItem.path">
                <i class="fas fa-th-large"></i>
                <span>{{ subItem.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!--        主体区域-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menulist: [],//侧边栏菜单数据
      isCollaose: false, //是否折叠菜单
      routeActive: '',// 当前高亮子路由
      // 菜单icon图标
      menuicon: [
        "fas fa-user-cog",
        "fas fa-wrench",
        "fas fa-shopping-bag",
        "fas fa-calculator",
        "fas fa-chart-line",
      ]
    }
  },
  created() {
    this.getMenuList()
    this.routeActive = "/" + (this.$route.path).split("/")[1]
  },
  methods: {
    // 注销
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取侧边菜单
    getMenuList() {
      this.$http.get('menus').then(response => {
        console.log(response);//请求正确时执行的代码
        let result = response.data
        if (result.meta.status == 200) {
          // this.$message.success(result.message)
          this.menulist = result.data
          // console.log(this.menulist)
        } else {
          this.$message.error('获取菜单数据异常！')
        }
      }).catch(response => {
        //发生错误时执行的代码
        this.$message.warning('服务器错误！')
        console.log(response)
      });
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollaose = !this.isCollaose
    }
  }
}
</script>

<style lang="less" scoped>
.home-div, .el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 20px;

  div {
    display: flex;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
    }

    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  transition: all 1s;
  background-color: #333744;

  .toggle-button > i {
    font-size: 30px;
    color: deepskyblue;
    line-height: 40px;
    display: block;
    text-align: center;
    cursor: pointer;
  }

  i {
    color: #fff;
    padding-right: 5px;
  }

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF1;
}
</style>
