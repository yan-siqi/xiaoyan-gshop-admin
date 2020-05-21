# 平台管理的增删改查

## 重点深拷贝和浅拷贝

- 针对的数据是引用类型的数据（注意不是一般的数据，没意义）
- 浅拷贝：只拷贝他的地址值，对本身数据不会拷贝
- 深拷贝：使用lodash工具包下边的copyDeep函数是拷贝引用类型的数据（所有数据）

### 面试时对深浅拷贝的应用

- 如果使用浅拷贝？可以解决属性名修改后不能取消的问题
- 此时是使用同一个数组attr，如果数据输入改变，点击取消里边的值也会变化
- 解决：利用{...attr}来对attr进行浅拷贝

- 在后台管理项目中商品管理的平台属性管理的属性值修改或者取消的问题，拷贝所有的数据

## 分类选择33级列表选择器组件

- 界面布局: Form / Select
- 动态获取列表数据
  - 获取1级列表 只选 2、3级列表为空
  - 获取2级列表  选 3级列表为空
  - 获取3级列表 发送请求 当前分页发生改变是分发事件
    - 通过分发事件向父组件中传递数据：`this.$emit('categoryChange', {categoryId: category3Id, level: 3})`
  - 携带categoryId和level数据

## 属性列表

- 界面布局：Card / Table / Tag / Button
- 绑定事件监听，接收分类列表的数据
- 动态获取数据显示
- 使用自定义带Hover文本提示的Button 
        HintButton: 内部对el-button进行二次封装
                    $attrs & v-bind / $listeners & v-on 
        <HintButton>: 属性不确定 / 事件监听不确定

## 属性的添加和修改

    添加/修改的界面布局: Form / Input / Button / Table / 
    列表界面与添加/修改界面的切换: isShowList
    显示添加界面: 指定attr对象中的attrName与attrValueList都为空值
    显示修改界面: 指定attr为当前选择的属性对象

## 属性值管理

    添加的新属性值显示是编辑模式, 而原本有的属性值显示是查看模式
        为属性值对象设计一个新的标识属性: edit
        显示时根据edit来判断是显示input还是span
        新添加的属性值对象, 添加一个edit属性为true
    在编辑模式下, 失去焦点或点enter键, 切换到查看模式
        在el-input的keyup监听必须通过.native指定为原生监听才有效果
        条件:
            必须输入了属性值名称
            不能与已有名称重复
        将属性值对象的edit指定为false
    在查看模式下, 点击文本, 当前项切换到编辑模式
        如果属性值对象有edit属性, 直接指定为true
        如果没有, 通过$set()添加edit属性, 值指定为true

    删除属性值
        利用属性值数组的splice()根据当前下标删除

    设计数据?
        类型: boolean
        名称: edit
        放在哪 attrValue对象

## 处理一系列问题
    问题1: 属性值名称点击响应区域太小了
    原因: span标签默认只占用文本区域
    解决: style="display: inline-block; width: 100%"

    问题2: 属性名称修改后不能取消
    原因: 列表与修改界面引用了同一个属性对象
    解决: 利用{...attr}来对attr进行浅拷贝

    问题3: 属性值列表修改后不能取消
    原因: 列表与修改界面引用了2个不同属性对象内部引用同一个attrValueList数组?
    解决: 利用lodash的copyDeep函数对attr进行深拷贝