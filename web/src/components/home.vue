<template>
  <el-container class="home_container">
    <el-header class="outerHeader">
        <div>
          <img src="../assets/img/avatar.png">
          <span>个人网盘系统</span>
        </div>
        <el-button type="info">信息按钮</el-button>
    </el-header>
    <el-container class="outerContainer">
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="switchDiv">
          <el-switch v-model="isCollapse"></el-switch>
        </div>
        <el-menu background-color="#545c64" text-color="#fff"
            active-text-color="#ffd04b" :default-openeds="['1']"
            :collapse="isCollapse" :collapse-transition="false" router
            :default-active='activeIndex'>
            <el-submenu index="1">
              <template #title>
                <i class="el-icon-menu"></i>
                <span>文件类型</span>
              </template>
              <el-menu-item-group>
                <template #title>分组</template>
                <el-menu-item v-for="item in menu_items" :index="item.index" :key="item.index">
                  <template #title> <!-- 这里一定要加#title!不然会不显示 -->
                    <i :class="item.icon"></i>
                    <span>{{item.title}}</span>
                  </template>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="outerMain">
        <el-container class="innerContainer">
          <el-header class="innerHeader">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
              <el-breadcrumb-item>{{String($route.path).substr(1)}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-upload
              class="upload-demo"
              action="http://localhost:3000/api/upload"
              ref="upload_demo"
              :on-preview="handlePreview"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              multiple
              :headers="myHeaders"
              :limit="30"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :show-file-list="show">
              <template #trigger> <!-- 如果指定了一定按钮为trigger，那么剩下的按钮将不会有trigger的作用 -->
                <el-button type="primary" class="uploadButton"><i class="el-icon-upload el-icon--left"></i>点击上传</el-button>
              </template>
              <el-button type="success" @click="clearFiles" v-if="buttonShow"><i class="el-icon-upload el-icon--left"></i>清空列表</el-button>
              <el-button @click="showFileList" v-if="buttonShow"><i class="el-icon-upload el-icon--left"></i>隐藏列表</el-button>
            </el-upload>
          </el-header>
          <!-- <el-card class="box-card"> -->
          <router-view />
          <!-- </el-card> -->
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false,
      menu_items: [
        {
          index: 'all',
          icon: 'el-icon-s-home',
          title: '全部文件'
        },
        {
          index: 'picture',
          icon: 'el-icon-picture',
          title: '图片'
        },
        {
          index: 'document',
          icon: 'el-icon-notebook-2',
          title: '文档'
        },
        {
          index: 'video',
          icon: 'el-icon-video-camera-solid',
          title: '视频'
        },
        {
          index: 'torrent',
          icon: 'el-icon-attract',
          title: '种子'
        },
        {
          index: 'music',
          icon: 'el-icon-headset',
          title: '音乐'
        },
        {
          index: 'other',
          icon: 'el-icon-s-promotion',
          title: '其他'
        }
      ],
      activeIndex: '',
      fileList: [],
      myHeaders: { Authorization: window.sessionStorage.getItem('token') },
      show: true,
      buttonShow: false
    }
  },
  methods: {
    beforeUpload () {
      this.buttonShow = true
    },
    clearFiles () {
      this.$refs.upload_demo.clearFiles()
      this.buttonShow = false
    },
    showFileList () {
      this.show = !this.show
    },
    handleSuccess (response, file, fileList) {
      this.$refs.childComponent.fresh()
      return file + fileList + response
    },
    handleRemove (file, fileList) {
      return file + fileList
    },
    handlePreview (file) {
      return file
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 30 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }
  },
  created () {
    this.activeIndex = String(this.$route.path).substr(1)
  },
  updated () {
    this.activeIndex = String(this.$route.path).substr(1)
  },
  beforeCreate () {
    document.querySelector('body').classList.add('Bg_Leaf')
  },
  beforeUnmount () {
    document.querySelector('body').classList.remove('Bg_Leaf')
  }
}
</script>

<style>
.Bg_Leaf {
    background: url("../assets/img/Bg_Leaf.jpg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
</style>
<style lang="less" scoped>
.home_container {
    height: 100%;
    overflow-y: hidden;
}
.outerHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: seashell;
    > div {
      display: flex;
      align-items: center;
      img {
        width: 60px;
        border-radius: 50%;
      }
      span {
        margin-left: 15px;
      }
    }
}
.el-aside {
    overflow-x: hidden;
    .el-menu {
      width: 100%;
    }
    .switchDiv {
    background-color: rgb(84, 92, 100);
    height: 35px;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    }
}
.outerMain {
    width: 100%;
    background-color: rgba(255, 245, 238, 0.9);
    .innerContainer {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: flex-start;
    .innerHeader {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .upload-demo {
        align-self: flex-start;
        position: relative;
        z-index: 999;
        .uploadButton {
            margin-right: 10px;
        }
      }
    }
    .box-card {
      height: 80%;
      width: 100%;
    }
  }
}
</style>
