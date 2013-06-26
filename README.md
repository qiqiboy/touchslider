TouchSlider
===========

> TouchSlider是一个轻量级的javascript组件，设计的目的是提供一个可以方便实现全平台（PC端所及移动端webkit内核触摸界面）的幻灯slider效果。

经过v1及v2的更新升级，目前其使用范围已经不仅仅限于幻灯片制作，更可以很方便的实现网站局部左右切换，通过提供的操作接口（.append(), .remove()），可以很方便的随时添加页面或者删除页面，实现在平台上的页面滑动。
示例见demo页面的第二个示例。

TouchSlider支持所有的浏览器，包括IE6、IE7等。PC上也支持鼠标模拟拖拽切换幻灯。

## 默认参数说明
```javascript
_default: {
    'id': 'slider', //string|elementNode 幻灯容器的id或者该节点对象
    'begin': 0, //Number 默认从第几个幻灯开始播放，从0开始
    'auto': true, //bool 是否自动播放
    'speed':600, //Number 动画效果持续时间,单位是毫秒
    'timeout':5000, //Number 幻灯播放间隔时间,单位毫秒
    'direction':'left', //string left|right|up|down 播放方向,四个值可选
    'align':'center', //string left|center|right 对齐方向（fixWidth=true情况下无效），靠左对齐（ipad版appStore上截图展现方式）、居中对齐（iphone版appStore上截图展现方式）、靠右对齐
    'fixWidth':true, //bool 默认会将每个幻灯宽度强制固定为容器的宽度,即每次只能看到一张幻灯；false的情况参见下方第一个例子
    'mouseWheel':false, //bool 是否支持鼠标滚轮
    'before':new Function(), //Function 幻灯切换前, before(newIndex, oldSlide)
    'after':new Function() //Function 幻灯切换后, after(newIndex, newSlide)
}
````
## 一些常用接口方法
```javascript
var slider=new TouchSlider(config);//config为配置参数，见上边说明
slider.pause();//暂停播放
slider.play();//开始播放
slider.prev();//上一张
slider.next();//下一张
slider.stop();//停止播放（暂停并回到第一张）
slider.append(newLi);//末尾添加一个幻灯项，参考下边第二个幻灯示例
slider.prepend(newLi);//开头添加一个幻灯项
slider.remove(index);//删除第index个幻灯，slider.remove(1)
slider.insertBefore(newLi,index);//在第index幻灯前插入一个幻灯
````

## demo地址
请点击http://u.boy.im/touchslider/
