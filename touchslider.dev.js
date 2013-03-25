/**
 * TouchSlider v1.2.8
 * By qiqiboy, http://www.qiqiboy.com, http://weibo.com/qiqiboy, 2013/03/25
 */
(function(window, undefined){
	
	"use strict";
	
	var hasTouch=("createTouch" in document) || ('ontouchstart' in window),
		testStyle=document.createElement('div').style,
		testVendor=(function(){
			var cases={
				'OTransform':['-o-','otransitionend'],
				'WebkitTransform':['-webkit-','webkitTransitionEnd'],
				'MozTransform':['-moz-','transitionend'],
				'msTransform':['-ms-','MSTransitionEnd'],
				'transform':['','transitionend']
			},prop;
			for(prop in cases){
				if(prop in testStyle)return cases[prop];
			}
			return false;
		})(),
		sg=[['width','left','right'],['height','top','bottom']],
		cssVendor=testVendor&&testVendor[0],
		toCase=function(str){
			return (str+'').replace(/^-ms-/, 'ms-').replace(/-([a-z]|[0-9])/ig, function(all, letter){
				return (letter+'').toUpperCase();
			});
		},
		testCSS=function(prop){
			var _prop=toCase(cssVendor+prop);
			return (prop in testStyle)&& prop || (_prop in testStyle)&& _prop;
		},
		parseArgs=function(arg,dft){
			for(var key in dft){
				if(typeof arg[key]=='undefined'){
					arg[key]=dft[key];
				}
			}
			return arg;
		},
		children=function(elem){
			var children=elem.children||elem.childNodes,
				_ret=[],i=0;
			for(;i<children.length;i++){
				if(children[i].nodeType===1){
					_ret.push(children[i]);
				}
			}
			return _ret;
		},
		each=function(arr,func){
			var i=0,j=arr.length;
			for(;i<j;i++){
				if(func.call(arr[i],i,arr[i])===false){
					break;
				}
			}
		},
		returnFalse=function(evt){
			evt=TouchSlider.fn.eventHook(evt);
			evt.preventDefault();
		},
		startEvent=hasTouch ? "touchstart" : "mousedown",
		moveEvent=hasTouch ? "touchmove" : "mousemove",
		endEvent=hasTouch ? "touchend" : "mouseup",
		transitionend=testVendor[1]||'',
		
		TouchSlider=function(id,cfg){
			if(!(this instanceof TouchSlider)){
				return new TouchSlider(id,cfg);
			}
			
			if(typeof id!='string' && !id.nodeType){
				cfg=id;
				id=cfg.id;
			}
			if(!id.nodeType){
				id=document.getElementById(id);
			}
			this.cfg=parseArgs(cfg||{},this._default);
			this.element=id;
			if(this.element){
				this.container=this.element.parentNode||document.body;
				this.setup();
			}
		}

	TouchSlider.fn=TouchSlider.prototype={
		version:'1.2.8',
		//默认配置
		_default: {
			'id':'slider', //幻灯容器的id
			'begin':0,
			'auto':true, //是否自动开始，负数表示非自动开始，0,1,2,3....表示自动开始以及从第几个开始
			'speed':600, //动画效果持续时间 ms
			'timeout':5000,//幻灯间隔时间 ms,
			'direction':'left', //left right up down
			'align':'center',
			'fixWidth':true,
			'mouseWheel':false,
			'before':new Function,
			'after':new Function
		},
		//设置OR获取节点样式
		css:function(elem,css){
			if(typeof css=='string'){
				var style=document.defaultView && document.defaultView.getComputedStyle && getComputedStyle(elem, null) || elem.currentStyle || elem.style || {};
				return style[toCase(css)];
			}else{
				var prop,
					propFix;
				for(prop in css){
					if(prop=='float'){
						propFix=("cssFloat" in testStyle) ? 'cssFloat' : 'styleFloat';
					}else{
						propFix=toCase(prop);
					}
					elem.style[propFix]=css[prop];
				}
			}
		},
		//绑定事件
		addListener:function(e, n, o, u){
			if(e.addEventListener){
				e.addEventListener(n, o, u);
				return true;
			} else if(e.attachEvent){
				e.attachEvent('on' + n, o);
				return true;
			}
			return false;
		},
		removeListener:function(e, n, o, u){
			if(e.addEventListener){
				e.removeEventListener(n, o, u);
				return true;
			} else if(e.attachEvent){
				e.detachEvent('on' + n, o);
				return true;
			}
			return false;
		},
		eventHook:function(origEvt){
			var evt={},
				props="changedTouches touches scale target view which clientX clientY fromElement offsetX offsetY pageX pageY toElement".split(" ");
			origEvt=origEvt||window.event;
			each(props,function(){
				evt[this]=origEvt[this];
			});
			evt.target=origEvt.target||origEvt.srcElement||document;
			if(evt.target.nodeType===3){
				evt.target=evt.target.parentNode;
			}
			evt.preventDefault=function(){
				origEvt.preventDefault && origEvt.preventDefault();
				evt.returnValue=origEvt.returnValue=false;
			}
			evt.stopPropagation=function(){
				origEvt.stopPropagation && origEvt.stopPropagation();
				evt.cancelBubble=origEvt.cancelBubble=true;
			}
			if(hasTouch&&evt.touches.length){
				evt.pageX=evt.touches.item(0).pageX;
				evt.pageY=evt.touches.item(0).pageY;
			}else if(typeof origEvt.pageX=='undefined'){
				var doc=document.documentElement,
					body=document.body;
				evt.pageX=origEvt.clientX+(doc&&doc.scrollLeft || body&&body.scrollLeft || 0)-(doc&&doc.clientLeft || body&&body.clientLeft || 0);
				evt.pageY=origEvt.clientY+(doc&&doc.scrollTop  || body&&body.scrollTop  || 0)-(doc&&doc.clientTop  || body&&body.clientTop  || 0);
			}
			evt.origEvent=origEvt;
			return evt;
		},
		//修正函数作用环境
		bind:function(func, obj){
			return function(){
				return func.apply(obj, arguments);
			}
		},
		//初始化
		setup: function(){
			this.slides=children(this.element);
			this.length=this.slides.length;
			this.cfg.timeout=parseInt(this.cfg.timeout);
			this.cfg.speed=parseInt(this.cfg.speed);
			this.cfg.begin=parseInt(this.cfg.begin);
			this.cfg.auto=!!this.cfg.auto;
			this.cfg.timeout=Math.max(this.cfg.timeout,this.cfg.speed);
			this.touching=!!hasTouch;
			this.css3transition=!!testVendor; 
			this.index=this.cfg.begin<0||this.cfg.begin>=this.length ? 0 : this.cfg.begin;
			
			if(this.length<1)return false;
			
			this.comment=document.createComment('\n Powered by TouchSlider v'+this.version+',\n author: qiqiboy,\n email: imqiqiboy@gmail.com,\n blog: http://www.qiqiboy.com,\n weibo: http://weibo.com/qiqiboy\n');
			this.container.insertBefore(this.comment,this.element);
			
			switch(this.cfg.direction){
				case 'up':
				case 'down':this.direction=this.cfg.direction; this.vertical=1; break;
				case 'right':this.direction='right';
				default:this.direction=this.direction||'left'; this.vertical=0; break;
			}

			this.addListener(this.element,startEvent,this.bind(this._start,this),false);
			this.addListener(document,moveEvent,this.bind(this._move,this),false);
			this.addListener(document,endEvent,this.bind(this._end,this),false);
			this.addListener(document,'touchcancel',this.bind(this._end,this),false);
			this.addListener(this.element,transitionend,this.bind(this.transitionend,this),false);
			
			this.addListener(window,'resize',this.bind(function(){
				clearTimeout(this.resizeTimer);
				this.resizeTimer=setTimeout(this.bind(this.resize,this),100);
			},this),false);
			
			if(this.cfg.mouseWheel){
				this.addListener(this.element,'mousewheel',this.bind(this.mouseScroll,this),false);
				this.addListener(this.element,'DOMMouseScroll',this.bind(this.mouseScroll,this),false);
			}
			this.playing=this.cfg.auto;
			this.resize();
		},
		getSum:function(type,start,end){
			var sum=0,i=start,
				_type=toCase('-'+type);
			for(;i<end;i++){
				sum+=this['getOuter'+_type](this.slides[i]);
			}
			return sum;
		},
		getPos:function(type,index){
			var _type=toCase('-'+type),
				myWidth=this.getSum(type,index,index+1),
				sum=this.getSum(type,0,index)+this['getOuter'+_type](this.element)/2-this['get'+_type](this.element)/2;
			switch(this.cfg.align){
				case 'left':
					return -sum;
				case 'right':
					return this[type]-myWidth-sum;
				default:return (this[type]-myWidth)/2-sum;
			}
		},
		resize:function(){
			clearTimeout(this.aniTimer);
			var _this=this,css,type=sg[this.vertical][0],_type=toCase('-'+type),
				pst=this.css(this.container,'position');
			this.css(this.container,{'overflow':'hidden','visibility':'hidden','listStyle':'none','position':pst=='static'?'relative':pst});
			this[type]=this['get'+_type](this.container);
			css={float:this.vertical?'none':'left',display:'block'};
			each(this.slides,function(){
				if(_this.cfg.fixWidth){
					css[type]=_this[type]-_this['margin'+_type](this)-_this['padding'+_type](this)-_this['border'+_type](this)+'px';
				}
				_this.css(this,css);
			});
			this.total=this.getSum(type,0,this.length);
			css={position:'relative',overflow:'hidden'};
			css[cssVendor+'transition-duration']='0ms';
			css[type]=this.total+'px';
			css[sg[this.vertical][1]]=this.getPos(type,this.index)+'px';
			this.css(this.element,css);
			this.css(this.container,{'visibility':'visible'});
			this.playing && this.play();
			return this;
		},
		slide:function(index, speed){
			var direction=sg[this.vertical][1],
				type=sg[this.vertical][0],
				transition=testCSS('transition'),
				nowPos=parseFloat(this.css(this.element,direction))||0,
				endPos,css={},change,size=this.getSum(type,index,index+1);
			index=Math.min(Math.max(0,index),this.length-1);
			speed=typeof speed=='undefined' ? this.cfg.speed : parseInt(speed);
			endPos=this.getPos(type,index);
			change=endPos-nowPos, //变化量
			speed=Math.abs(change)<size?Math.ceil(Math.abs(change)/size*speed):speed;
			if(transition){
				css[transition]=direction+' ease '+speed+'ms';
				css[direction]=endPos+'px';
				this.css(this.element,css);
			}else{
				var _this=this,
					begin=0, //动画开始时间
					time=speed/10,//动画持续时间
					animate=function(t,b,c,d){ //缓动效果计算公式
						return -c * ((t=t/d-1)*t*t*t - 1) + b;
					},
					run=function(){
						if(begin<time){
							begin++;
							_this.element.style[direction]=Math.ceil(animate(begin,nowPos,change,time))+'px';
							_this.aniTimer=setTimeout(run,10);
						}else{
							_this.element.style[direction]=endPos+'px';
							_this.transitionend({propertyName:direction});
						}
					}
				clearTimeout(this.aniTimer);
				run();
			}
			this.cfg.before.call(this,index,this.slides[this.index]);
			this.index=index;
			return this;
		},
		play:function(){
			clearTimeout(this.timer);
			this.playing=true;
			this.timer=setTimeout(this.bind(function(){
				this.direction=='left'||this.direction=='up' ? this.next() : this.prev();
			},this), this.cfg.timeout);
			return this;
		},
		pause:function(){
			clearTimeout(this.timer);
			this.playing=false;
			return this;
		},
		stop:function(){
			this.pause();
			return this.slide(0);
		},
		prev:function(offset,sync){
			clearTimeout(this.timer);
			var index=this.index;
			offset=typeof offset == 'undefined'?offset=1:offset%this.length;
			index-=offset;
			if(sync===false){
				index=Math.max(index,0);
			}else{
				index=index<0?this.length+index:index;
			}
			return this.slide(index);
		},
		next:function(offset,sync){
			clearTimeout(this.timer);
			var index=this.index;
			if(typeof offset=='undefined')offset=1;
			index+=offset;
			if(sync===false){
				index=Math.min(index,this.length-1);
			}else{
				index%=this.length
			}
			return this.slide(index);
		},
		_start:function(evt){
			evt=this.eventHook(evt);
			var name=evt.target.nodeName.toLowerCase();
			if(!this.touching && (name=='a'||name=='img'))evt.preventDefault();
			this.removeListener(this.element,'click',returnFalse);
			this.startPos=[evt.pageX,evt.pageY];
			this.element.style[toCase(cssVendor+'transition-duration')]='0ms';
			this.startTime=+new Date;
			this._pos=parseFloat(this.css(this.element,sg[this.vertical][1]))||0;
		},
		_move:function(evt){
			if(!this.startPos || evt.scale&&evt.scale!==1)return;
			evt=this.eventHook(evt);
			this.stopPos=[evt.pageX,evt.pageY];
			var range,direction=sg[this.vertical][1],
				type=sg[this.vertical][0],
				offset=this.stopPos[this.vertical]-this.startPos[this.vertical];
			if(this.scrolling || typeof this.scrolling=='undefined'&&Math.abs(offset)>=Math.abs(this.stopPos[1-this.vertical]-this.startPos[1-this.vertical])){
				evt.preventDefault();
				offset=offset/((!this.index&&offset>0 || this.index==this.length-1&&offset<0) ? (Math.abs(offset)/this[type]+1) : 1);
				this.element.style[direction]=this._pos+offset+'px';
				if(window.getSelection!=null){
					range=getSelection();
					if(range.empty)range.empty();
					else if(range.removeAllRanges)range.removeAllRanges();
				}
				if(offset&&typeof this.scrolling=='undefined'){
					this.scrolling=true;//标记拖动（有效触摸）
					clearTimeout(this.timer);//暂停幻灯
					clearTimeout(this.aniTimer);//暂停动画
				}
			}else this.scrolling=false;
		},
		_end:function(evt){
			if(this.startPos){
				if(this.scrolling){
					var type=sg[this.vertical][0],
						direction=sg[this.vertical][1],
						offset=this.stopPos[this.vertical]-this.startPos[this.vertical],
						absOff=Math.abs(offset),
						sub=absOff/offset,
						myWidth,curPos,tarPos,
						next=this.index,off=0;
					this.addListener(this.element,'click',returnFalse);
					if(absOff>20){//有效移动距离
						curPos=parseFloat(this.css(this.element,sg[this.vertical][1]));
						do{
							if(next>=0 && next<this.length){
								tarPos=this.getPos(type,next);
								myWidth=this.getSum(type,next,next+1);
							}else{
								next+=sub;
								break;
							}
						}while(Math.abs(tarPos-curPos)>myWidth/2 && (next-=sub));
						off=Math.abs(next-this.index);
						if(!off && +new Date-this.startTime<250){
							off=1;
						}
					}
					offset>0?this.prev(off,false):this.next(off,false);
					
					this.playing && this.play();
				}
				delete this._pos;
				delete this.stopPos;
				delete this.startPos;
				delete this.scrolling;
				delete this.startTime;
			}
		},
		mouseScroll:function(evt){
			if(this.cfg.mouseWheel){
				evt=this.eventHook(evt);
				var _this=this,
					e=evt.origEvent,
					toX=0,toY=0,
					to;
				if('wheelDeltaX' in e){
					toX=e.wheelDeltaX;
					toY=e.wheelDeltaY;
				}else if('wheelDelta' in e){
					toY=e.wheelDelta;
				}else if('detail' in e){
					toY=-e.detail;
				}else{
					return;
				}
				if(!this.vertical && Math.abs(toX)>Math.abs(toY)){
					to=toX;
				}else if(toY && (!e.wheelDeltaX || this.vertical&&Math.abs(toX)<Math.abs(toY))){
					to=toY;
				}
				if(to){
					evt.preventDefault();
					clearTimeout(this.mouseTimer);
					this.mouseTimer=setTimeout(function(){
						to>0?_this.prev(1,false):_this.next(1,false);
					},100);
				}
			}
		},
		transitionend:function(evt){
			if(evt.propertyName==sg[this.vertical][1]){
				this.cfg.after.call(this, this.index, this.slides[this.index]);
				this.playing && this.play();
			}
		},
		refresh:function(){
			this.slides=children(this.element);
			this.length=this.slides.length;
			if(this.index>=this.length){
				this.index=this.length-1;
			}
			this.resize();
		},
		append:function(elem){
			this.element.appendChild(elem);
			this.refresh();
		},
		insertBefore:function(elem,target){
			this.element.insertBefore(elem,target);
			this.refresh();
		},
		remove:function(elem){
			this.element.removeChild(elem);
			this.refresh();
		}
	}

	each(['Width','Height'],function(i,type){
		var _type=type.toLowerCase();
		each(['margin','padding','border'],function(j,name){
			TouchSlider.fn[name+type]=function(elem){
				return (parseFloat(this.css(elem,name+'-'+sg[i][1]+(name=='border'?'-width':'')))||0)+(parseFloat(this.css(elem,name+'-'+sg[i][2]+(name=='border'?'-width':'')))||0);
			}
		});
		TouchSlider.fn['get'+type]=function(elem){
			return elem['offset'+type]-this['padding'+type](elem)-this['border'+type](elem);
		}
		TouchSlider.fn['getOuter'+type]=function(elem){
			return elem['offset'+type]+this['margin'+type](elem);
		}
	});
	
	window.TouchSlider=TouchSlider;
})(window);