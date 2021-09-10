<template>
  <div class="login_container">
    <div class="login_box">
      <!--      头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--      登录表单区域-->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0px" class="login_form">
        <!--        用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="fas fa-user"></el-input>
        </el-form-item>
        <!--        密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="fas fa-lock"></el-input>
        </el-form-item>
        <!--        按钮-->
        <el-form-item class="btns">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="resetLoginForm" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 登录表单数据对象
      loginForm: {
        username: '',
        password: ''
      },
      // 表单验证规则对象
      loginFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: ['blur', 'change']},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: ['blur', 'change']}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: ['blur', 'change']},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: ['blur', 'change']}
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login() {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          // alert("校验不通过")
          return
        }
        let params = new URLSearchParams()
        params.append("username", this.loginForm.username)
        params.append("password", this.loginForm.password)
        this.$http.post('login', params).then(response => {
          console.log(response);//请求正确时执行的代码
          let result = response.data
          if (result.meta.status == 200) {
            this.$message.success(result.meta.msg)
            window.sessionStorage.setItem("token", result.data.token)
            this.$router.push("/home")
          } else {
            this.$message.error('用户名或密码错误！')
          }
        }).catch(response => {
          //发生错误时执行的代码
          this.$message.warning('服务器错误！')
          console.log(response)
        });
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    text-align: center;
  }
}
</style>
