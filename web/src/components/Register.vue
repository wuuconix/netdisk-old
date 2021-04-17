<template>
  <div class="register_container">
    <div class="register_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/img/avatar_R.png">
      </div>
      <!-- 注册表单区域 -->
      <el-form @submit.prevent="register" ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="0px" class="register_form">
        <el-form-item prop="username">
            <el-input placeholder="请输入用户名"  v-model="registerForm.username" clearable prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码"  v-model="registerForm.password" show-password clearable prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" round native-type="submit">注册</el-button>
          <el-button type="info" round @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      registerForm: {
        username: '',
        password: ''
      },
      registerFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    goBack () {
      this.$router.push('/login')
    },
    register () {
      this.$refs.registerFormRef.validate(valid => {
        if (!valid) return
        this.$http.post('register', this.registerForm)
          .then(res => {
            console.log(res.data.message)
            if (res.data.message === 'duplicated') {
              this.$message.error('抱歉 用户名已被注册')
            } else {
              this.$message.success('注册成功 现在登录吧~')
              this.$router.push('/login')
            }
          })
      })
    }
  },
  created: function () {
    this.$notify.info({
      title: '消息',
      message: '现在是注册界面哦',
      duration: 3000
    })
  },
  beforeCreate () {
    document.querySelector('body').classList.add('Bg_R')
  },
  beforeUnmount () {
    document.querySelector('body').classList.remove('Bg_R')
  }
}
</script>

<style>
.Bg_R {
  background: url("../assets/img/Bg_R.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>

<style lang="less" scoped>
.register_container {
  height: 100%;
}
.register_box {
  width: 40%;
  height: 350px;
  background-color: rgba(75, 81, 95, 0.75);
  box-shadow: 7px 7px 17px rgba(52, 66, 58, 0.5);
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

.register_form {
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
