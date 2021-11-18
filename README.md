# 基于Vue.js和Node.js的个人网盘

## 介绍

作者科技立项[2020.10-2021.11]的成果

前端Vue3，后端Node.js的Express，数据库是Mongodb

能够实现上传文件、下载文件、在线预览、文件链接分享等操作

其中能够在线预览的文件种类大致有图片、视频、音频和pdf

## 在线体验

本项目只提供校内服务，请使用校园网访问

https://netdisk.wuuconix.link

注意必须要是https

## 自己搭建环境 

如果你想尝试在自己的电脑上运行这个项目，不必去配置麻烦的环境

作者封装了一个docker镜像可以一键部署

对应docker镜像  wuucoinx/netdisk。

镜像内部设置好了一切，内置mongodb，内置nodejs，内置nginx

需要映射两个端口，一个是nginx的80端口，用来提供vue生成的静态页面

一个是nodejs的3000端口，用来提供相应的api服务

当你利用这个镜像开启一个容器的时侯，内部的服务会自动开启，entrypoint在容器的 /usr/local/bin/entrypoint.sh

运行示例

```
 docker run -itd --name netdisk -p 8888:80 -p 3000:3000 wuuconix/netdisk
```

然后你就能通过 http://127.0.0.1:8888 访问到该项目啦！
