

# Drag 页面拖拽
>基于bootstrap的页面元素拖拽  
项目演示：[demo](https://7cming.github.io/drag/build/drag.html)  
备用演示：[demo](https://mugenming.gitee.io/drag/build/drag.html)  

|Author|7c|
|----------|-----------------
|E-mail    |774669939@qq.com

## 版本
v1.0 2018-10
> 完成基本的整体布局及功能规划  
左侧组件区域规划出 栅格布局、~~块元素~~、按钮、表单元素以及easyui控件几个部分，后续根据需要再添加  
右侧为拖拽及展示区域，对拖拽元素进行**编辑**、**移除**等操作  
整体页面功能规划出 **清除**、**暂存**、**查看**及**下载**  

v1.1 2018-10
> 组件使用accordion进行分类显示  
使用jQuery UI组件实现拖拽、放置及排序  
优化加载遮罩效果及部分操作联动  
对form进行拆分，可以对form元素进行添加、移除  

>调整组件分类默认顺序；去掉块元素，分散至其他组件分类中  
对拖拽区域添加了拖拽接受限制  
>>初始化拖拽区只接受grid组件  
grid组件接受其余组件分类中元素（from分类首个）  
form元素只能拖拽至form分类首个元素  

v2.0 2018-11
> 除easyui外基本组件的编辑功能及部分组件的样式修改功能  
清除、暂存、查看、下载功能，添加预览功能  

> 对各组件添加了编辑功能  
整体功能基本完成  
  
  
* 有问题或建议发送邮件给我   

## 介绍

### 通用
>框架核心依赖bootstrap;  
拖拽实现依赖jquery-ui；  
将easyui兼容后引入，基本编辑，可直接修改文本；  

### 使用
>根据需要设置布局（*栅格row分12格，以空格为分隔，数字为12即生成对应的栅格，拖动至右侧即可*）；  
选择控件拖拽至右侧区域，根据需要进行编辑（*所有组件都需要以栅格为基础*）；  
完成后点击**查看**复制代码到文件或点击**下载**下载为文件到本地；  
快捷操作：
>>清除：Ctrl+Q  
暂存：Ctrl+S  
预览：Ctrl+P  
查看：Ctrl+F  
下载：Ctrl+D  
在编辑状态下  
关闭：Alt+C  
保存：Alt+S  

### 第三方文档
- [Bootstrap](http://www.bootcss.com/)  
- [jQuery](https://www.jquery123.com/)  
- [jQuery UI](http://www.css88.com/jquery-ui-api/)  
- [EasyUI](http://www.jeasyui.net/tutorial/)  
  
  
Powered By **7c**  
