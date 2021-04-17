<template>
    <el-table :data="showFile" border style="width: 100%" max-height="510" stripe :default-sort = "{prop: 'uploadtime', order: 'descending'}">
    <el-table-column prop="filename" label="文件名" min-width="50%" sortable :show-overflow-tooltip="true">
      <template #scope>
        <svg class="icon" aria-hidden="true" v-if="imgList.indexOf(scope.row.type) != -1"><use xlink:href="#icon-picture"></use></svg>
        <svg class="icon" aria-hidden="true" v-else-if="docList.indexOf(scope.row.type) != -1"><use xlink:href="#icon-doc"></use></svg>
        <svg class="icon" aria-hidden="true" v-else-if="videoList.indexOf(scope.row.type) != -1"><use xlink:href="#icon-video"></use></svg>
        <svg class="icon" aria-hidden="true" v-else-if="torrentList.indexOf(scope.row.type) != -1"><use xlink:href="#icon-torrent"></use></svg>
        <svg class="icon" aria-hidden="true" v-else-if="musicList.indexOf(scope.row.type) != -1"><use xlink:href="#icon-music"></use></svg>
        <svg class="icon" aria-hidden="true" v-else><use xlink:href="#icon-other"></use></svg>
        <span style="margin-left: 10px">{{ scope.row.filename }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="size" label="大小" min-width="17.5%" sortable></el-table-column>
    <el-table-column prop="uploadtime" label="上传日期" min-width="17.5%" sortable></el-table-column>
    <el-table-column label="操作" min-width="15%">
      <template #scope>
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button @click="downloadFile(scope.row)" type="text" size="small">下载</el-button>
        <el-button type="text" size="small" @click="deleteFile(scope.row)">删除</el-button>
      </template>
    </el-table-column>
    <div>2333</div>
  </el-table>
</template>

<script>
export default {
  methods: {
    handleClick (row) {
      console.log (row.size);
    },
    fresh () {
      this.$http.get('file').then(res => {
        this.allRawFile = res.data
      })
    },
    formatBytes (size)
    {
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
    }
  },
  data () {
    return {
      allRawFile: [],
      imgList: ['png', 'jpg', 'jpeg', 'bmp'],
      docList: ['docx', 'pptx', 'doc', 'ppt', 'txt', 'md', 'xlsx', 'xls'],
      videoList: ['mp4', 'mkv'],
      musicList: ['mp3', 'flac'],
      torrentList: ['torrent'],
    }
  },
  // created () {
  //   this.fresh()
  // },
  computed: {
    allFile () {
      var array = []
      for (var i = 0; i < this.allRawFile.length; i++) {
        var file = this.allRawFile[i]
        file.size = this.formatBytes(Number(file.size))
        file.type = file.filename.split('.').pop()
        array.push(file)
      }
      // console.log(array)
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
      return array
    },
    allList () {
      return this.imgList.concat(this.docList).concat(this.musicList).concat(this.torrentList).concat(this.videoList) //concat用来连接两个列表
    },
    List () {  //List用来选择哪个文件列表，比如在picture页面时就需要选择imgList
      var type = String(this.$route.path).substr(1)
      if (type == 'all') return this.allList
      if (type == 'picture') return this.imgList
      if (type == 'document') return this.docList
      if (type == 'video') return this.videoList
      if (type == 'torrent') return this.torrentList
      if (type == 'music') return this.musicList
      return null
    }
  }
}
</script>

<style lang="less" scoped>
</style>