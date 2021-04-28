const express = require('express')

const app = express()

app.use(express.json())
app.use(require('cors')())
app.use(express.static('public')) //用来托管静态文件，实现前端通过url访问文件

require('./routes/index')(app)
require('./plugins/db')(app)

app.listen(3000, () => {
  console.log('http://localhost:3000')
})