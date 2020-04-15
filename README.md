## 目的
学习实践 babel

## 创建和测试 babel plugin

1. 在 plugin 目录下添加自定义的插件
2. 在 babel.config.json plugin 通过相对路径引入该 plugin 
3. 运行 package.json 中的 script ，在 lib 目录下查看 plugin 编译后的效果

## 工具
[syntax tree](https://esprima.org/demo/parse.html)

## 理论

### package
* @babel/core 核心功能
* @babel/cli 提供命令工具, 例如我们在 script 中使用的 babel 命令就是安装了它


### plugin
定义使用哪些插件
```
// 已经安装在 node_modules
{    "plugins": ["@babel/plugin-transform-arrow-functions"]}

// 相对路径,可以放在项目中任意文件夹中
{    "plugins": ["./node_modules/@babel/plugin-transform-arrow-functions"]}
```