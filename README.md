# 基于Vue.js和Node.js的个人网盘

科技立项[2020.10-2021.11]

前端Vue3，后端Node.js的Express，数据库是Mongodb

能够实现上传文件、下载文件、在线预览、文件链接分享等操作。

其中能够在线预览的文件种类大致有图片、视频、音频和pdf。

对应docker镜像  wuucoinx/netdisk。

镜像内部设置好了一切，内置mongodb，内置nodejs，内置nginx。

需要映射两个端口，一个是nginx的80端口，用来提供vue生成的静态页面。

一个是nodejs的3000端口，用来提供相应的api服务。

运行示例

```
 docker run -itd --name netdisk -p 8888:80 -p 3000:3000 wuuconix/netdisk
```

然后你就能通过 http://127.0.0.1:8888 访问到该项目啦！
