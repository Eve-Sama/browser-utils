[English](README.md) | 简体中文

### 介绍

本项目是一个浏览器插件, 技术栈为JQuery+TypeScript+Gulp. 其功能为快速关闭浏览器tabs. 有两种方式触发入口, 第一种为点击图标, 

![avatar](https://file.qingflow.com/uploads/file/d70f3404-6aa1-47e2-b6f7-cf88570a187f.png)

第二种是在网页中按下快捷键 `Alt + Q`.
![avatar](https://file.qingflow.com/uploads/file/002480c2-a596-4aca-90c6-868d98debb0c.png)

在功能上这两种方式都没差, 他们主要用来满足以下三种功能
 
 - 关闭所有的左侧标签
 - 关闭所有的右侧标签
 - 关闭除了当前标签之外的所有标签

### 本地运行

执行 `npm run start` 后, 项目会自动编译文件资源, 编译完成后会产生dist目录, 将其导入浏览器即可.

### 打包

执行 `npm run build` , 与本地运行并无太大区别, 只是编译资源的一些配置项有所变动, 如是否压缩代码. 编译完成后会产生dist目录, 通过Chrome打包即可.

### 更新日志

* **0.0.4:** fix: 关闭异常当打开多个浏览器窗口
* **0.0.3:** fix: 火狐上显示异常
* **0.0.2:** feat: 设置快捷键 Alt+Q
* **0.0.1:** feat: 发布基础功能