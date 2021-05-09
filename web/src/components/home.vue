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
        <el-menu background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :default-openeds="['1']"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router
                 :default-active='activeIndex'>
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-menu"></i>
              <span>文件类型</span>
            </template>
            <el-menu-item-group>
              <template #title>分组</template>
              <el-menu-item v-for="item in menu_items"
                            :index="item.index"
                            :key="item.index">
                <template #title>
                  <!-- 这里一定要加#title!不然会不显示 -->
                  <i :class="item.icon"></i>
                  <span>{{ item.title }}</span>
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
            <el-upload class="upload-demo"
                       :action="uplaod_action"
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
              <template #trigger>
                <!-- 如果指定了一定按钮为trigger，那么剩下的按钮将不会有trigger的作用 -->
                <el-button type="primary"
                           class="uploadButton"><i class="el-icon-upload el-icon--left"></i>点击上传</el-button>
              </template>
              <el-button type="success"
                         @click="clearFiles"
                         v-if="buttonShow"><i class="el-icon-upload el-icon--left"></i>清空列表</el-button>
              <el-button @click="showFileList"
                         v-if="buttonShow"><i class="el-icon-upload el-icon--left"></i>隐藏列表</el-button>
            </el-upload>
            <el-image id="preview-picture"
                      style="width: 75px; height: 75px;"
                      :src="require('@/assets/logo.png')"
                      :preview-src-list="[url_picture]">
            </el-image>
          </el-header>
          <el-main class="innerMain">
            <el-table :data="showFile"
                      border
                      style="width: 100%"
                      max-height="510"
                      stripe
                      :default-sort="{prop: 'uploadtime', order: 'descending'}">
              <el-table-column prop="filename"
                               label="文件名"
                               min-width="50%"
                               sortable
                               :show-overflow-tooltip="true">
                <template v-slot:default='scope'>
                  <svg class="icon"
                       aria-hidden="true"
                       v-if="imgList.indexOf(scope.row.type) != -1">
                    <use xlink:href="#icon-picture"></use>
                  </svg>
                  <svg class="icon"
                       aria-hidden="true"
                       v-else-if="docList.indexOf(scope.row.type) != -1">
                    <use xlink:href="#icon-doc"></use>
                  </svg>
                  <svg class="icon"
                       aria-hidden="true"
                       v-else-if="videoList.indexOf(scope.row.type) != -1">
                    <use xlink:href="#icon-video"></use>
                  </svg>
                  <svg class="icon"
                       aria-hidden="true"
                       v-else-if="torrentList.indexOf(scope.row.type) != -1">
                    <use xlink:href="#icon-torrent"></use>
                  </svg>
                  <svg class="icon"
                       aria-hidden="true"
                       v-else-if="musicList.indexOf(scope.row.type) != -1">
                    <use xlink:href="#icon-music"></use>
                  </svg>
                  <svg class="icon"
                       aria-hidden="true"
                       v-else>
                    <use xlink:href="#icon-other"></use>
                  </svg>
                  <span style="margin-left: 10px">{{ scope.row.filename }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="size"
                               label="大小"
                               min-width="17.5%"
                               sortable></el-table-column>
              <el-table-column prop="uploadtime"
                               label="上传日期"
                               min-width="17.5%"
                               sortable></el-table-column>
              <el-table-column label="操作"
                               min-width="15%">
                <template v-slot:default='scope'>
                  <el-button @click="previewFile(scope.row)"
                             type="text"
                             size="small">查看</el-button>
                  <el-button @click="downloadFile(scope.row)"
                             type="text"
                             size="small">下载</el-button>
                  <el-button @click="shareFile(scope.row)"
                             type="text"
                             size="small">分享</el-button>
                  <el-button @click="deleteFile(scope.row)"
                             type="text"
                             size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <!-- 存一些dialog，防止破坏布局 -->
            <el-dialog :title="video_title"
                       v-model="dialogVideoVisible"
                       :destroy-on-close='true'>
              <!-- 设置关闭dialog时自动删除内部元素，这样视频就不会再播放了 -->
              <video-player class="video-player vjs-custom-skin"
                            ref="videoPlayer"
                            :playsinline="true"
                            :options="playerOptions">
              </video-player>
            </el-dialog>
            <div class="div_pdf"
                 style="display:fixed">
              <!-- 套一层div为给不同dialog写不同的css做做准备 -->
              <el-dialog v-model="dialogPdfVisible"
                         :destroy-on-close='true'
                         :fullscreen='true'
                         :modal='true'>
                <ViewPDF :pdfUrl="url_pdf"></ViewPDF>
              </el-dialog>
            </div>
            <div class="div_music">
              <el-dialog :title="music_title"
                         v-model="dialogAudioVisible"
                         :destroy-on-close='true'
                         center>
                <audio :src="url_music"
                       type="audio/mpeg"
                       controls="controls">
                </audio>
              </el-dialog>
              <el-dialog title="共享链接"
                         v-model="dialogShareVisible"
                         :destroy-on-close='true'
                         center>
                <!-- 设置关闭dialog时自动删除内部元素，这样视频就不会再播放了 -->
                <p>{{ url_share }}</p>
              </el-dialog>
            </div>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import ViewPDF from "@/components/ViewPDF";

export default {
  components: {
    ViewPDF,
  },
  data () {
    return {
      ip: '10.245.143.5',
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
      buttonShow: false,
      allRawFile: [],
      imgList: ['png', 'jpg', 'jpeg', 'bmp'],
      docList: ['docx', 'pptx', 'doc', 'ppt', 'txt', 'md', 'xlsx', 'xls', 'pdf'],
      videoList: ['mp4', 'mkv'],
      musicList: ['mp3', 'flac'],
      torrentList: ['torrent'],
      url_picture: "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
      url_video: "",
      url_pdf: "http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf",
      url_share: "",
      url_music: "",
      video_title: 'video-preview',
      music_title: 'music_preview',
      dialogVideoVisible: false,
      dialogPdfVisible: false,
      dialogAudioVisible: false,
      dialogShareVisible: false,
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        autoplay: false,
        muted: false,
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: true,
        sources: [{
          type: "video/mp4",
          src: ''
        }],
        poster: '',
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          //全屏按钮
          fullscreenToggle: true
        }
      },
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
      this.fresh()
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
    },
    fresh () {
      this.$http.get('file').then(res => {
        this.allRawFile = res.data
        console.log(res.data)
      })
      return 1
    },
    formatBytes (size) {
      var units = [' B', ' KB', ' MB', ' GB', ' TB']
      for (var i = 0; size >= 1024 && i < 4; i++)
        size /= 1024;
      return size.toFixed(2) + units[i];
    },
    deleteFile (row) {
      this.$http.post('delete', { filename: row.filename }).then(res => {
        if (res.data.message == "delete ok!") {
          this.$message({ message: '删除成功！', type: 'success' })
          this.fresh()
        }
        else
          this.$message({ message: '删除失败！请重试', type: 'error' })
      })
    },
    downloadFile (row) {
      const filename = row.filename
      this.$http.get('download', { params: { filename }, responseType: 'blob' }).then(res => {
        const blob = new Blob([res.data]);
        const link = document.createElement('a')//创建a标签
        link.download = filename//a标签添加属性
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()//执行下载
        URL.revokeObjectURL(link.href) //释放url
        document.body.removeChild(link)//释放标签
      })
        .catch(err => {
          console.log(err)
        })
    },
    previewFile (row) {
      const filename = row.filename
      this.$http.get('preview', { params: { filename } }).then(res => {
        if (row.type == 'jpg' || row.type == 'png') {
          this.url_picture = res.data.url
          const link = document.getElementById('preview-picture');
          link.click()
        }
        else if (row.type == 'mp4') {
          this.playerOptions.sources[0].src = res.data.url; //vue-video-player需要这样动态绑定src，直接在里面用变量不行
          this.video_title = row.filename
          this.dialogVideoVisible = true
        }
        else if (row.type == 'pdf') {
          this.dialogPdfVisible = true
          this.url_pdf = res.data.url
        }
        else if (row.type == 'mp3') {
          this.dialogAudioVisible = true
          this.url_music = res.data.url
        }
        console.log(res.data.url)
      })
    },
    shareFile (row) {
      const filename = row.filename
      this.$http.get('share', { params: { filename } }).then(res => {
        this.url_share = res.data.url
        this.dialogShareVisible = true
        console.log(res.data.url)
      })
    }
  },
  computed: {
    uplaod_action () {
      return "http://" + this.ip + ":3000/api/upload"
    },
    allFile () {
      var array = []
      for (var i = 0; i < this.allRawFile.length; i++) {
        var file = this.allRawFile[i]
        file.size = this.formatBytes(Number(file.size))
        file.type = file.filename.split('.').pop()
        array.push(file)
      }
      return array
    },
    showFile () {
      if (String(this.$route.path).substr(1) == 'all') return this.allFile //all页面不能用allList直接处理，因为allList中没有other文件的后缀，会导致文件显示不全
      if (String(this.$route.path).substr(1) == 'other') {     //如果是other页面需要单独处理，如果后缀名不在allList中，则加入arrayOther中
        var arrayOther = []
        for (var i = 0; i < this.allFile.length; i++) {
          var fileOther = this.allFile[i]
          if (this.allList.indexOf(fileOther.type) == -1) {
            arrayOther.push(fileOther)
          }
        }
        return arrayOther
      }
      var array = [] //不是other的情况，List做为一个computed变量已经做出了处理，指向了相应的列表，直接使用即可
      for (var j = 0; j < this.allFile.length; j++) {
        var file = this.allFile[j]
        if (this.List.indexOf(file.type) != -1) {
          array.push(file)
        }
      }
      console.log(array)
      return array
    },
    allList () {
      return this.imgList.concat(this.docList).concat(this.musicList).concat(this.torrentList).concat(this.videoList) //concat用来连接两个列表
    },
    List () {  //List用来选择哪个文件列表，比如在picture页面时就需要选择imgList
      var type = String(this.$route.path).substr(1)
      if (type === 'all') return this.allList
      if (type === 'picture') return this.imgList
      if (type === 'document') return this.docList
      if (type === 'video') return this.videoList
      if (type === 'torrent') return this.torrentList
      if (type === 'music') return this.musicList
      return null
    }
  },
  created () {
    this.activeIndex = String(this.$route.path).substr(1)
    this.fresh()
  },
  updated () {
    this.activeIndex = String(this.$route.path).substr(1)
    this.fresh()
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
  height: 1080px;
  // overflow-y: hidden;
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
  }
}
</style>
