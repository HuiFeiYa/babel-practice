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
#### @babel/preset-env
主要作用是对我们所使用的并且目标浏览器中缺失的功能进行代码转换和加载 polyfill，在不进行任何配置的情况下，@babel/preset-env 所包含的插件将支持所有最新的JS特性(ES2015,ES2016等，不包含 stage 阶段)，将其转换成ES5代码。

#### .browserslistrc
官方推荐使用 .browserslistrc 文件来指定目标环境。默认情况下，如果你没有在 Babel 配置文件中(如 .babelrc)设置 targets 或 ignoreBrowserslistConfig
如果你不是要兼容所有的浏览器和环境，推荐你指定目标环境，这样你的编译代码能够保持最小。
#### @babel/plugin-transform-runtime
@babel/plugin-transform-runtime 是一个可以重复使用 Babel 注入的帮助程序，以节省代码大小的插件。

首先安装依赖，@babel/plugin-transform-runtime 通常仅在开发时使用，但是运行时最终代码需要依赖 @babel/runtime，所以 @babel/runtime 必须要作为生产依赖被安装
### plugin
定义使用哪些插件
```
// 已经安装在 node_modules
{    "plugins": ["@babel/plugin-transform-arrow-functions"]}

// 相对路径,可以放在项目中任意文件夹中
{    "plugins": ["./node_modules/@babel/plugin-transform-arrow-functions"]}
```

### preset
通过使用或创建一个 preset 即可轻松使用一组插件。相当于官方给你封装好了一组 plugin 你只需要引入一次，就可以将一组 plugin 都引入。

### polyfill
因为语法转换只是将高版本的语法转换成低版本的，但是**新的内置函数、实例方法无法转换**。这时，就需要使用 polyfill 上场了

包括以下： Promise 和 WeakMap 之类的新的内置组件、 Array.from 或 Object.assign 之类的静态方法、Array.prototype.includes 之类的实例方法
> V7.4.0 版本开始，@babel/polyfill 已经被废弃(前端发展日新月异)，需单独安装 core-js 和 regenerator-runtime 模块。 regenerator-runtime是 @bebel/polyfill 的依赖不需要单独安装

*使用@babel/polyfill*  
需要将完整的 polyfill 在代码之前加载，所以需要安装在 dependencies 中
使用方法：
1. 直接在代码中引入
```
import '@babel/polyfill';

const isHas = [1,2,3].includes(2);

const p = new Promise((resolve, reject) => {
    resolve(100);
});
复
```
2. 在webpack中 配置
```
entry: [
    require.resolve('./polyfills'),
    path.resolve('./index')
]
// polyfills.js 文件内容如下:
import '@babel/polyfill';
```

*优化* 
我们更期望的是，如果我使用了某个新特性，再引入对应的 polyfill，避免引入无用的代码。如果引入整个包，@babel/polyfill的包大小为89K (当前 @babel/polyfill 版本为 7.7.0)。

@babel/preset-env 提供了一个 useBuiltIns 参数，设置值为 usage 时，就只会包含代码需要的 polyfill 。有一点需要注意：配置此参数的值为 usage ，必须要同时设置 corejs (如果不设置，会给出警告，默认使用的是"corejs": 2)

推荐使用 core-js@ core-js@2 分支中已经不会再添加新特性，新特性都会添加到 core-js@3。
```
"presets": [
    [
      "@babel/env",
      {
        "useBuiltIns":"usage",
        "corejs":3
      }
    ]
  ],
```

未使用 useBuiltIns 属性前编译后的文件
```
"use strict";

require '@babel/polyfill';

var isHas = [1, 2, 3].includes(2);
var p = new Promise(function (resolve, reject) {
  resolve(100);
});
```

使用后
```
"use strict";

require("core-js/modules/es.array.includes");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

var isHas = [1, 2, 3].includes(2);
var p = new Promise(function (resolve, reject) {
  resolve(100);
});
```

能看到最终的代码大小仅为: 20KB。而如果我们引入整个 @babel/polyfill 的话，构建出的包大小为：89KB

### @babel/plugin-transform-runtime
替代 "@babel/preset-env" 中的 useBuiltIns 配置
移除了 @babel/preset-env 的 useBuiltIns 的配置，不然就重复了
```
{
  "presets": [
    [
      "@babel/env"
    ]
  ],
  "plugins": [
    "./plugin/a2b.js",
    "@babel/plugin-transform-arrow-functions",
    [
      "@babel/plugin-transform-runtime",{
        "corejs": 3
      }
    ]
  ]
}
```