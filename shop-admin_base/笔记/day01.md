# day01

## 后台管理

- 是对项目的二次开发,在已有的功能进行完善和修改操作
- 特点:参考别人已经写好的代码模式
- swager UI ：测试接口文档。
- 参考element组件:https://element.eleme.cn/#/zh-CN/component

## ES6模块化导入导出的深入理解和使用

- 1.导出方式一: 默认一次性导出 (只能有一个)
    export default xxx
    本质: 整个模块是一个对象, 对象中有default属性, 即: {default: xxx}
- 2.导出方式二: 非默认分别导出 (可以有多个)
    export yyy
    export zzz
    本质: 整个模块是一个对象, 对象中有yyy和zzz属性, 即: {yyy, zzz}    
- 3.导出方式三: 非默认统一导出 (可以有多个)    
    export {yyy, zzz}
    本质:  整个模块是一个对象, 对象中有yyy和zzz属性, 即: {yyy, zzz}  

- 4.导入方式一: 导入默认导出的模块
    简洁写法: import xxx from './test' // 可以是任意名称
     完整写法: import {default as xxx} from './test'
- 5.导入方式二: 导入分别导出的模块
    import {yyy, zzz} from './test'  // 必须是指定的名称
- 6.导入方式三: 导入整个/所有模块(包括默认与非默认导出的)
  import * as obj from './test' // 可以是任意名称
  obj的结构: {default, yyy, zzz}

- 7.导入并导出: 对导入的模块同时做导出的操作
  export {default as xxx} from './test'
  export {yyy, zzz} from './test'
  当前模块的结构: {xxx, yyy, zzz}34

## 实现功能模块基本步骤步骤

- 搭建静态组件界面
- 动态显示数据
- 做交互功能

### 品牌分页列表分三层

- 1.添加按钮
  - 页面布局包括:dialog/form/input/upload(添加图片的方块)/button ,涉及组件间的通信使用sync
  - 问题1:再上传图片的时候会出现跨域问题?
  - 解决:
  - 在配置文件中添加相关配置使用代理服务器进行转发:baseURL: process.env.VUE_APP_BASE_API
  - 上传图片时:
  - action="/dev-api/admin/product/fileUpload"//指定接口地址
    :on-success="handleLogoSuccess"//上传成功是调用的回调函数
    :before-upload="beforeLogoUpload">//是准备发送请求前的回调函数,如果返回值是false,就不发送请求
  - 问题2:关闭Dialog, 再打开还能看到前面输入的数据
  - 原因:通过样式来控制标签结构的显示和隐藏,当界面重新显示时,其实是复用前边的界面数据还存在
  - 解决:关闭时,清除数据
  - 问题3:显示dialog后, 输入数据,但不提交,直接关闭, 再点添加, 显示的dialog就会显示前面的输入的数据
  - 解决:添加的回调中重置数据
- 2.列表
- 3.分页(品牌的删除)
    - 提交删除品牌的请求, 并在请求成功后, 重新显示分页列表
    - 页码:默认删除是在当前页码,如果只剩下一条数据,就显示上一页的数据  