<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/img/avatar.png">
      </div>
      <!-- 登录表单区域 -->
      <el-form @submit.prevent="login" ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名"  v-model="loginForm.username" clearable prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码"  v-model="loginForm.password" show-password clearable prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" round native-type="submit">登录</el-button>
          <el-button type="info" round @click="registerNow">立即注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "change" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "change",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return;
        this.$http.post("login", this.loginForm).then((res) => {
          console.log(res.data);
          if (res.data.message === "right") {
            this.$message({
              message: `${this.loginForm.username} 欢迎回来~`,
              type: "success",
            });
            window.sessionStorage.setItem("token", "Bearer " + res.data.token);
            this.$router.push("/home");
          } else {
            this.$message({
              message: `${res.data.message}哦~`,
              type: "error",
            });
          }
        });
      });
    },
    registerNow () {
      this.$router.push("/register");
    },
  },
  created: function () {
    this.$notify.info({
      title: "消息",
      message: "现在是登录界面哦",
      duration: 3000,
    });
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
}
.login_box {
  width: 40%;
  height: 350px;
  background-color: rgba(75, 81, 95, 0.75);
  box-shadow: 7px 7px 17px rgba(52, 56, 66, 0.5);
  border-radius: 5px;
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
    background-color: #eee;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .login_form {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    width: 50%;
    bottom: 10%;
  }
  .btns {
    display: flex;
    justify-content: center;
  }
}
</style>
