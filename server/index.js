const express = require('express')
const https = require('https')
const app = express()
const fs = require('fs')

app.use(express.json())
app.use(require('cors')())
app.use(express.static('public')) //用来托管静态文件，实现前端通过url访问文件

require('./routes/index')(app)
require('./plugins/db')(app)

// app.listen(3000, () => {
//   console.log('http in 3000; https in 3001')
// })


var privateKey = fs.readFileSync('./ssl-link/private.pem');
var certificate = fs.readFileSync('./ssl-link/fullchain.pem');

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(3000);