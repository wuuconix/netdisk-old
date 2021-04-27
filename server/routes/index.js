const { Console } = require('console')

// 安装模块有 multer fs jsonwebtoken
module.exports = app => {
  const express = require('express')
  const jwt = require('jsonwebtoken')
  const multer = require('multer')
  const fs = require('fs')
  const router = express.Router()
  const User = require('../models/User')
  const SECRET = 'wuuconix yyds!'

  const auth = async (req, res, next) => { 
    // 中间件，根据token在数据库中查找对应id，然后把username加在req中供后续代码使用
    try {
      const token = String(req.headers.authorization).split(' ')[1];
      console.log(token)
      console.log(jwt.verify(token, SECRET))
      const { id } = jwt.verify(token, SECRET)
      const user = await User.findById(id)
      if (user) {
        const { username } = user
        req.username = username
        req.isValid = true
        next()
      }
    } catch (e) {
      console.log(e)
    }
  }
  router.post('/register', async (req, res) => {
    var message = 'ok'
    const user = await User.findOne({ username: req.body.username })
    if (user) 
      return res.send({ message: 'duplicated' })
    await User.create(req.body, (err) => {
      if (err)
        message = 'wrong'
        console.log(err)
    })
    await fs.mkdir(`./files/${req.body.username}`, (err) => {   
      if (err)/* 这里的目录是根据真正的index来确定的，因为此文件的route最终被挂载到app上 */
        message = 'something happened during mkdir in register'
    })
    res.send({ message })
  })

  router.post('/login', async (req, res) => {
    const user = await User.findOne({
      username: req.body.username
    })
    if (!user) {
      return res.send({
        message: '用户名不存在'
      })
    }
    if (req.body.password != user.password) {
      return res.send({
        message: '密码错误'
      })
    }
    const token = jwt.sign({
      id: String(user._id)
    }, SECRET)
    console.log(token)

    res.send({
      user,
      token,
      message: 'right'
    })
  })
  router.post('/upload', multer({ dest: './files/temp' }).single('file'), auth,
    async (req, res) => {
      var file = req.file
      await fs.renameSync(file.path, `./files/${req.username}/${file.originalname}`)
      res.send({ file: file, message: 'ok' })
      return  //结束这次router.post
    }
  )
  router.get('/download', auth, (req, res) => {
      req.query.filename ? res.download(`./files/wuuconix/${req.query.filename}`) : res.send({
        message: 'failed to download file'
      })
  })
  router.get('/file', auth, (req, res) => {
    var fileRawList = []
    var fileList = []
    fileRawList = fs.readdirSync(`./files/${req.username}`, { withFileTypes: true })
    for (var i = 0; i < fileRawList.length; i++) {
      var file = {}
      const { name } = fileRawList[i]
      const fileStats = fs.statSync(`./files/${req.username}/${name}`)
      file.filename = name
      var uploadtimeRaw = new Date(Number(String(fileStats.birthtimeMs).split('.')[0])).toLocaleString('zh', { hour12: false, timeZone: 'Asia/Shanghai' })
      var target = uploadtimeRaw.split(' ').pop().split(':')
      if (target[0] == '24') target[0] = '00'
      file.uploadtime = uploadtimeRaw.split(' ')[0] + " " + target.join(":")
      file.size = fileStats.size
      fileList.push(file) 
    }
    res.send(fileList)
  })
  router.post('/delete', auth, (req, res) => {
    const filename = req.body.filename
    fs.unlinkSync(`./files/${req.username}/${filename}`)
    res.send({ message: 'delete ok!' })
  })
  app.use('/api', router)
}