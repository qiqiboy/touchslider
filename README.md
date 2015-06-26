TouchSlider
===========
> #### 与 pageSwitch 的区别
> rger

> TouchSlider是一个轻量级的javascript组件，设计的目的是提供一个可以方便实现全平台（PC端所及移动端webkit内核触摸界面）的幻灯slider效果。

TouchSlider支持所有的浏览器，包括IE6、IE7等。PC上也支持鼠标模拟拖拽切换幻灯。

## 如何使用
```javascript
// 首先在页面中引入touchslider.js
// 调用 TouchSlider 方法

var ts=new TouchSlider('container id',{
	duration:600,			//int 页面过渡时间
	direction:1,			//int 页面切换方向，0横向，1纵向
    start:0,				//int 默认显示页面
	align:'center',			//string 对齐方式，left(top) center(middle) right(bottom)
	mouse:true,				//bool 是否启用鼠标拖拽
    mousewheel:false,		//bool 是否启用鼠标滚轮切换
	arrowkey:false,			//bool 是否启用键盘方向切换
	fullsize:true,			//bool 是否全屏幻灯（false为自由尺寸幻灯）
    autoplay:true,	    	//bool 是否自动播放幻灯
	interval:int			//bool 幻灯播放时间间隔
});

//调用方法
ts.prev(); 					//上一张
ts.next();					//下一张
ts.slide(n);				//第n张

ts.play();			    	//播放幻灯
ts.pause();		        	//暂停幻灯

ts.prepend(DOM_NODE);		//前增页面
ts.append(DOM_NODE);		//后增页面
ts.insertBefore(DOM_NODE,index);	//在index前添加
ts.insertAfter(DOM_NODE,index);		//在index后添加
ts.remove(index);			//删除第index页面
ts.isStatic();				//是否静止状态

ts.destroy();				//销毁TouchSlider效果对象

/* 事件绑定
 * event可选值:
 * 
 * before 页面切换前
 * after 页面切换后
 * dragStart 开始拖拽
 * dragMove 拖拽中
 * dragEnd 结束拖拽
 */
ts.on(event,callback);
````

## demo地址
请点击http://u.boy.im/touchslider/
