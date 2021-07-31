<template>
  <div class="login_container">
    <!-- 登陆组件 -->
    <div class="login_box">
      <!-- 这个是登陆的白色的盒子 -->
      <!-- 在这个登陆盒子中，可以放一个头像的盒子 -->
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登陆表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
          <!-- 注意：使用字体图标时基类iconfont不能省 -->
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <!-- prop我还是不熟悉啊！！！ -->
          <!-- 注意：验证规则是加给item的，不是加给文本框的 -->
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  //    name:'login'
  //    这个不写也行，老师就没写
  data() {
    return {
      // 这个是登陆表单的数据绑定对象
      // 用户名和密码应该绑定到这个对象的某个属性身上
      // 所以我们再定义username和password这2个具体的属性
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //   这是表单的验证规则对象
      loginFormRules: {
        //   验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
          //首先，用户名是必填项，所以required:true
          // trigger表名触发时间，文本框失去焦点时进行触发
          // 一个大括号里面就是一个验证规则
          // 接下来我们如何让用户名的验证规则生效呢？
          // 复制验证规则，找到上面的el-form-item，指定一个prop="username"
        ],
        //   验证密码是否合法
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    //   点击重置按钮，重置登陆表单
    resetLoginForm() {
      // console.log(this);
      // 这个this就指向当前登陆组件的实例对象
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return
        // 表示如果valid为false,我们就不发起请求了
        // 要发起请求，肯定要使用对应的包：Axios
        // console.log(this);
        // console.log(this.$http);
        // const result = await this.$http.post('login',this.loginForm)
        // console.log(result);
        // API中写了,login就是请求路径！！！！
        // 这个地址需要一些参数，就是this.loginForm！！！！！！
        // 用户在表单中填写的数据会自动同步到loginForm中。
        // 所以参数就直接写loginForm就可以了
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 解构赋值，这个对象中只要data属性，给它重命名为res
        // console.log(res);
        // if(res.meta.status !== 200) return console.log('登陆失败')
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        // console.log('登陆成功');
        this.$message.success('登陆成功')
        // 1.将登录成功之后的token，保存到客户端的 sessionstorage中
        //    1.1项目中除了登录之外的其他API接口，必须在登录之后才能访问
        //    1.2token只应在当前网站打开期间生效，所以将 token 保存在sessionstorage中
        // 注意：sessionstorage是会话期间的存储机制，而localstorage是持久期间的存储机制
        // 所以将token保存在sessionstorage里面比较合适
        // console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        // 这样我们就把token保存到了sessionstorage中
        // 2.通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
        // 这种属于编程式导航，只不过现在home页面现在还没有提供
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 代表这个节点中支持less语法
// scoped用来控制组件样式生效的区间
// 加上scoped说明这个样式只在当前组件内生效
// 一个组件它的样式肯定是来美化自己组件结构的，不应该涉及到别人
// 所以一定要记得加scoped，用来防止样式冲突
// 接下来我们需要在router.js中通过路由的形式将它渲染到App根组件中

.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  // 圆角边框

  // 接下来我们要把这个盒子放到页面的正中间
  position: absolute;
  // 绝对定位脱标，孤魂野鬼
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  // 我们可以使用Less的语法嵌套写法放一个样式在里面
  .avatar_box {
    // 首先给这个盒子设置一个宽高
    height: 130px;
    width: 130px;
    // 接下来我们给这个盒子加一个外侧边框线
    border: 1px solid #eee;
    // 头像圆角的比较好看
    border-radius: 50%;
    // overflow: hidden;
    // background-color: pink;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    // 给外面的边框线加阴影
    // 现在开始把位置摆正，avator_box向右移动大盒子的一半减去自己盒子的一半和向上移动自己盒子的一半就可以了
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    // translate里面的百分比是根据盒子的高度来进行位移的
    background-color: #fff;
    // 不加背景色会很难看
    img {
      width: 100%;
      height: 100%;
      // 让里面的图片等于父盒子的宽高，设置为100%
      // background-color: blue;
      border-radius: 50%;
      // 图片和父盒子都要加这个圆角属性才行
      // 或者父盒子overflow:hidden我试了也行
      // 但是后面还要图片离盒子保持距离，所以不要选择overflow:hidden了
      // 给图片加背景颜色
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  // 这个时候我们发现文本框并没有占满整个区域
  // 我们可以设置宽度为父盒子的100%即可
  width: 100%;
  // 我们为了让它左右有边距，可以给他加padding
  // 上下0，左右20
  padding: 0 20px;
  box-sizing: border-box;
  // 不设置box-sizing的话表单会超出右边部分的
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
