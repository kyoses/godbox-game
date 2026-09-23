var lastP = 0;
var lastGap = 0;
var touchIdentifier=0;//触摸状态下触摸手指的标识
var lastTouchTime=0;
var sliderInterval = 0;
var getEPos=getEventX;
jQuery.fn.setSlider = function (obj) {
    /*
    row = 1; //每一页显示多少行
    col = 1; //每一页显示多少列
    dir="left";	//滑动方向向左或向右
	onPageChange;//当前页面变动时触发的事件
	pagerID//页脚
    */
    if (this.data("isSlider") == undefined) {
		this.css("overflow","hidden");
		var init = { row: 1, col: 1, dir: "margin-left" };
		if (obj) {
			if (obj.dir == "top") {
				obj.dir = "margin-top";
				getEPos = getEventY;
			}
			else {
				obj.dir = "margin-left";
				getEPos = getEventX;
			}
			for(key in obj){
				if(key=="onPageChange"){
					this.get(0).onPageChange=obj[key];
				}
				else if(key=="onMove"){
					this.get(0).onMove=obj[key];
				}
				else{
					init[key]=obj[key];
				}
			}
		}
        if (isMobile) {
            this.get(0).addEventListener(touchDown, Slider.touchDownHandler, false);
            this.get(0).addEventListener(touchMove, Slider.touchMoveHandler, false);
            this.get(0).addEventListener(touchUp, Slider.touchUpHandler, false);
        }
        else {
            this.get(0).addEventListener(touchDown, Slider.touchDownHandler, false);
        }
		if(init.row*init.col==1&&!init.multiPage){//无分页模式
			if(init.dir=="margin-left"){
				this.append("<div style='width:0px;'></div>");//内容元素的父元素
			}
			else{
				this.append("<div></div>");//内容元素的父元素
			}
		}
		else{
			this.append("<div style='width:0px;height:0px;'></div>");//内容元素的父元素
		}
        this.data("isSlider", init);
    }
}
jQuery.fn.addSliderItem = function (node) {
    var init = this.data("isSlider");
    var containerNum = init.row * init.col;
    if (containerNum > 1|| init.multiPage) {//有分页滑动
        var len = this.children().slice(0, 1).children().last().children().length;
        if (len % parseInt(containerNum) == 0) {
            var child = "<div style='float:left; width:" + this.width() + "px;" + "height:" + this.height() + "px" + ";'></div>";
			if (init.dir == "margin-top") {
				this.children().slice(0, 1).height(this.children().slice(0, 1).height() + this.height());
			}
			else {
				this.children().slice(0, 1).width(this.children().slice(0, 1).width() + this.width());
			}
            this.children().slice(0, 1).append(child);
			this.addPager(init);
        }
        this.children().slice(0, 1).children().last().append(node);
    }
    else {//无分页滑动
		var obj=$(node);
		this.children().slice(0, 1).append(obj);
		if (init.dir == "margin-left") {
            var size = obj.outerWidth(true);
			this.children().slice(0, 1).width(this.children().slice(0, 1).width()+size);
        }
    }
}
//往分页滑动中第一个为空的位置插入元素
/*参数
@emptyCon:元素为空的条件(jQuery查找条件)
@item:要插入的元素
@goToInsertPage:是否将当前页码自动滑动到插入元素的页码
*/
jQuery.fn.insertSliderItem=function(emptyCon,item,goToInsertPage){
	var thisObj=this;
	var hasInserted=false;
	this.children().slice(0,1).children().each(function(index){
		var emptyObj=$(this).find(emptyCon);
		if(emptyObj.length>0){
			emptyObj.first().replaceWith(item);
			hasInserted=true;
			if(goToInsertPage){
				thisObj.goToPage(index);
			}
			return false;
		}
	});
	if(!hasInserted){
		thisObj.addSliderItem(item);
		thisObj.goToLastPage();
	}
}
jQuery.fn.addPage=function(goToLast){
	var init = this.data("isSlider");
	var child = "<div style='float:left; width:" + this.width() + "px;" + "height:" + this.height() + "px" + ";'></div>";
	this.children().slice(0, 1).width(this.children().slice(0, 1).width() + this.width());
	this.children().slice(0, 1).append(child);
	this.addPager(init);
	var pager=$("#"+init.pagerID);
	if(goToLast){
		this.goToPage(pager.children().length-1);
	}
}
jQuery.fn.addPager=function(init){
	if(init==undefined){
		init=this.data("isSlider");
	}
	var pager=$("#"+init.pagerID);
	var obj=$(Slider.pagerStr);
	pager.append(obj);
	var thisObj=this;
	obj.bind(clickEventType,function(){
		thisObj.goToPage($(this).index());
	});
	if(pager.children().length==1){//默认第一个选中
		pager.children().first().removeClass("flip").addClass("flipC");
	}
}
jQuery.fn.removeAllItem=function(){
	var init=this.data("isSlider");
	if(init){
		if(init.pagerID){
			var pager=$("#"+init.pagerID);
			pager.empty();
		}
		this.children().first().empty();
		if(init.row*init.col==1&&!init.multiPage){//无分页模式
			if(init.dir=="margin-left"){
				this.children().first().css({width:"0px"});
				
			}
			this.children().first().css(init.dir,"0px");
		}
	}
}
jQuery.fn.removeSlider=function(){//移除滑动事件，变为普通元素
	this.get(0).removeEventListener(touchDown, Slider.touchDownHandler, false);
	this.get(0).removeEventListener(touchMove, Slider.touchMoveHandler, false);
	this.get(0).removeEventListener(touchOut, Slider.touchUpHandler, false);
	this.get(0).removeEventListener(touchUp, Slider.touchUpHandler, false);
}
//有分页的方法
jQuery.fn.goToPage = function (pageIndex) {
	if(sliderInterval!=0) return;
    var currentPageIndex=this.currentPageIndex();
	if(currentPageIndex==pageIndex) return;
	if(currentPageIndex>pageIndex){
		this.children().slice(0,1).children().slice(pageIndex+1,currentPageIndex).hide();
		lastGap=2;
	}
	else{
		this.children().slice(0,1).children().slice(currentPageIndex+1,pageIndex).hide();
		lastGap=-2;
	}
	Slider.hasPage(this.get(0));
}
//没有动画的翻页
jQuery.fn.goToPageNoAnimation=function(pageIndex){
	var currentPageIndex=this.currentPageIndex();
	if(currentPageIndex==pageIndex) return;
	var init=this.data("isSlider");
	var slimit=(init.dir=="margin-top"?this.height():this.width());
	var nowPos=parseInt(this.children().first().css(init.dir));
	this.children().first().css(init.dir,nowPos+slimit*(currentPageIndex-pageIndex));
}
jQuery.fn.moveToPrevPage=function(){
	var currentIndex=this.currentPageIndex();
	if(currentIndex>0){
		this.goToPage(--currentIndex);
	}
}
jQuery.fn.moveToNextPage=function(){
	var pageLen=this.children().slice(0,1).children().length;
	var currentIndex=this.currentPageIndex();
	if(currentIndex<pageLen-1){
		this.goToPage(++currentIndex);
	}
}
jQuery.fn.goToLastPage=function(){
	var len=this.children().slice(0,1).children().length;
	var left=(len-1)*this.children().slice(0,1).children().slice(0,1).width();
	this.children().slice(0,1).css("margin-left",-left+"px");
}
jQuery.fn.currentPageIndex=function(){
	var left=parseInt(this.children().slice(0,1).css("margin-left"));
	var index=Math.abs(parseInt(left/this.width()));
	return index;
}
jQuery.fn.currentPage=function(){
	var index=this.currentPageIndex();
	return this.children().slice(0,1).children().slice(index,index+1);
}
//

//无分页的方法
jQuery.fn.moveToEnd=function(){
	var init=this.data("isSlider");
	
	if(init.dir=="margin-top"){
		var pLen=this.height();
		var cLen=this.children().slice(0,1).height();
	}
	else{
		var pLen=this.width();
		var cLen=this.children().slice(0,1).width();
	}
	if(cLen>pLen){
	var nowInstance=parseInt(this.children().slice(0,1).css(init.dir));	
	var move=Math.abs(nowInstance)+pLen-cLen;
	Slider.noPage(this.get(0),move);
	}
}
jQuery.fn.moveDistance=function(distance){
	var init=this.data("isSlider");
	if(init.dir=="margin-top"){
		var pLen=this.height();
		var cLen=this.children().slice(0,1).height();
	}
	else{
		var pLen=this.width();
		var cLen=this.children().slice(0,1).width();
	}
	if(cLen>pLen){
		Slider.noPage(this.get(0),-distance);
	}
}

//自动填充
jQuery.fn.autoFillItem=function(template){
	var init = this.data("isSlider");
	var containerNum = init.row * init.col;
	if(containerNum>1){
		var lastPageItemLen=this.children().first().children().last().children().length;
		if(lastPageItemLen<containerNum){
			if(this.children().first().children().length<=0){//一页都没有
				this.addPage();
			}
			for(i=lastPageItemLen;i<containerNum;i++){
				this.children().first().children().last().append(template);
			}
		}
	}
}

var Slider = {
    touchDownHandler: function (e) {
        if (isMobile) {
            if (touchIdentifier == 0) {
                touchIdentifier = e.touches[0].identifier;
                lastTouchTime = new Date();
            }
            else {
                var now = new Date();
                if (now - lastTouchTime >= 500) {
                    touchIdentifier = e.touches[0].identifier;
                    lastTouchTime = new Date();
                }
                else {
                    return;
                }
            }
        }
        lastP = getEPos(e);
		lastGap=0;
        clearInterval(sliderInterval);
        sliderInterval = 0;

        if (!isMobile) {
            this.addEventListener(touchMove, Slider.touchMoveHandler, false);
            this.addEventListener(touchOut, Slider.touchUpHandler, false);
            this.addEventListener(touchUp, Slider.touchUpHandler, false);
        }
    },
    touchMoveHandler: function (e) {
        var init = $(this).data("isSlider");
        if (isMobile) {
            if (e.changedTouches[0].identifier != touchIdentifier) return;
        }
        var nowX = getEPos(e);
        var gap = nowX - lastP;
        $(this).children().slice(0, 1).css(init.dir, parseInt($(this).children().slice(0, 1).css(init.dir)) + gap);
        lastP = nowX;
        lastGap = gap;
		if($(this).attr("sliding")==undefined){
			$(this).attr("sliding",true);
		}
		if(this.onMove){
			this.onMove();
		}
        e.preventDefault();
        e.cancelBubble = true;
    },
    touchUpHandler: function (e) {
        if (isMobile) {
            if (e.changedTouches[0].identifier != touchIdentifier) return;
            touchIdentifier = 0;
        }
        if (!isMobile) {
            this.removeEventListener(touchMove, Slider.touchMoveHandler, false);
            this.removeEventListener(touchOut, Slider.touchUpHandler, false);
            this.removeEventListener(touchUp, Slider.touchUpHandler, false);
        }
        var init = $(this).data("isSlider");
        if (init.row > 1 || init.col > 1 || init.multiPage) {
            Slider.hasPage(this);
        }
        else {
            Slider.noPage(this);
        }
    },
    hasPage: function (obj) {
        var init = $(obj).data("isSlider");
        if (init.dir == "margin-top") {//确定边界
            var slimit = $(obj).height();
            var blimit = $(obj).children().slice(0, 1).height();
        }
        else {
            var slimit = $(obj).width();
            var blimit = $(obj).children().slice(0, 1).width();
        }
        var mPos = parseInt($(obj).children().slice(0, 1).css(init.dir));
        mod = Math.abs(mPos % slimit);
        if (mPos > 0) {//到达第一页(无法向右再移动)自动向左(上)移动一页
            move = -mPos;
        }
        else if (Math.abs(mPos) > (blimit - slimit)) {//到达最后一页(无法再向左移动)
            move = mod + Math.floor((Math.abs(mPos) + slimit - blimit)/slimit)*slimit;
        }
        else {
            if (lastGap > 1) {//自动向右(下)移动一页
                move = mod;
				if(mod==0){
					move=$(obj).width();
				}
				lastGap=0;
            }
            else if (lastGap < -1) {//自动向左(上)移动一页
                move = -$(obj).width() + mod;
				lastGap=0;
            }
            else {
                if (mod >= slimit / 2) {//自动退回或者自动向左(上)翻一页
                    move = -slimit + mod;
                }
                else {//自动退回或者自动向右(下)翻一页
                    move = mod;
                }
            }
        }
        if (isMobile) {
            var factor = 90;
        }
        else {
            var factor = 70;
        }
        var allNum = 1000 / factor;
        var oneMove = Math.floor(move / allNum);
        if (Math.abs(oneMove) < 1)
            oneMove = Math.abs(move) / move;
		if(move!=0){
			sliderInterval = setInterval(Slider.hasPageHandler, 17, { all: move, one: oneMove, dir: init.dir }, obj);
		}
		else{
			$(obj).removeAttr("sliding");//释放滑动状态
		}
    },
    hasPageHandler: function (move, obj) {
        var nowX = parseInt($(obj).children().slice(0, 1).css(move.dir));
        if (Math.abs(move.all) < 100 && Math.abs(move.all) >= 5) {//缓冲效果
            move.one = Math.floor(move.all * 0.2);
        }
        if (Math.abs(move.all) < Math.abs(move.one)) {
            move.one = move.all;
        }
        $(obj).children().slice(0, 1).css(move.dir, nowX + move.one);
        move.all -= move.one;
        if (move.all * move.one <= 0) {
            clearInterval(sliderInterval);
			sliderInterval=0;
			Slider.onPageChange(obj,obj.onPageChange);
			$(obj).removeAttr("sliding");
        }
		else{
			if(obj.onMove){//响应onmove事件
				obj.onMove();
			}
		}
    },
    noPage: function (obj,all) {
        var init = $(obj).data("isSlider");
        if (init.dir == "margin-top") {//确定边界
            var slimit = $(obj).height();
            var blimit = $(obj).children().slice(0, 1).height();
        }
        else {
            var slimit = $(obj).width();
            var blimit = $(obj).children().slice(0, 1).width();
        }

        var move = lastGap; //Math.abs(lastGap)/lastGap*15;
        if (Math.abs(move) > 50) {
            move = Math.abs(lastGap) / lastGap * 50;
        }
        var num = 5;
        var moveJS = {
            num: num,
            one: move,
            dir: init.dir,
            sl: slimit,
            bl: blimit,
            buffer: move * num * 2
        }
		if(all){
			moveJS.all=all;
		}
		if(sliderInterval)
			clearInterval(sliderInterval);
        sliderInterval = setInterval(Slider.noPageHandler, 17, moveJS, obj);
    },
    noPageHandler: function (move, obj) {
        var nowP = parseInt($(obj).children().slice(0, 1).css(move.dir));
        if (!move.all) {
            if (move.num > 0) {
                var one = move.one;
                move.num--;
            }
            else {
                var one = Math.floor(move.buffer * 0.2); //缓冲
                if (Math.abs(one) < 1)
                    one = Math.abs(one) / one;
                move.buffer -= one;
            }
            $(obj).children().slice(0, 1).css(move.dir, nowP + one);
			if(obj.onMove){//响应onmove事件
				obj.onMove();
			}

            if (nowP + one >0) {//移出左(上)边界自动退回
                move.one = 0;
                move.all = -(nowP + one);
                return;
            }
            else if (move.bl >= move.sl) {//内容长度大于容器长度时
                var extra = Math.abs(nowP + one) + move.sl - move.bl;
                if (extra >0) {//移出右(下)边界自动退回
                    move.one = 0;
                    move.all = extra;
                    return;
                }
            }
            else if (move.bl < move.sl) {//内容长度小于容器长度时
                var extra = Math.abs(nowP + one);
                if (extra > 0) {//移出右(下)边界自动退回
                    move.one = 0;
                    move.all = extra;
                    return;
                }
            }
            if (move.buffer * lastGap <= 0) {
                clearInterval(sliderInterval);
				sliderInterval=0;
				$(obj).removeAttr("sliding");
            }
        }
        else if (move.all) {//移除边界自动退回
            var one = Math.floor(move.all * 0.2); //缓冲
            if (Math.abs(one) < 1)
                one = Math.abs(move.all) / move.all;
			if(Math.abs(one)>Math.abs(move.all)) {one=move.all};
			$(obj).children().slice(0, 1).css(move.dir, nowP + one);
			if(obj.onMove){//响应onmove事件
				obj.onMove();
			}
            move.all -= one;
            if (move.all == 0) {
                clearInterval(sliderInterval);
				sliderInterval=0;
				$(obj).removeAttr("sliding");
            }
        }
    },
	pagerStr:'<span class="flip" style="display:inline-block"></span>',
	onPageChange:function(obj,callBack){
		var init=$(obj).data("isSlider");
		if(init.pagerID){
			var pager=$("#"+init.pagerID);
			var pagerIndex=pager.find(".flipC").index();
		}
		else{
			var pagerIndex=$(obj).currentPageIndex();
		}
		var nowPos=Math.abs(parseInt($(obj).children().first().css(init.dir)));
		var slimit=(init.dir=="margin-top"?$(obj).height():$(obj).width());
		var showPageIndex=Math.floor(nowPos/slimit);
		if(pagerIndex==showPageIndex){
			if(init.pagerID){
				return;
			}
			else{
				var children=$(obj).children().first().children();
				children.each(function(index){
					if($(this).css("display")=="none"){
						var nowPos=parseInt($(obj).children().first().css(init.dir));
						$(this).show();
						//if(index<=pagerIndex){
							$(obj).children().first().css(init.dir,nowPos-slimit);
						//}
						//else{
							//$(obj).children().first().css(init.dir,nowPos+slimit);
						//}
					}
				});
			}
		}
		else{
			if(pagerIndex<showPageIndex){
				var nextPages=$(obj).children().first().children().slice(pagerIndex+1);
				nextPages.each(function(){
					nowPos=parseInt($(obj).children().first().css(init.dir));
					if($(this).css("display")=="none"){
						$(this).show();
						showPageIndex++;
						$(obj).children().first().css(init.dir,nowPos-slimit);
					}
					else{
						return false;
					}
				});
				//var betweenPages=$(obj).children().first().slice(pagerIndex+1,showPageIndex);
			}
			else{
				var prevPages=$(obj).children().first().children().slice(0,pagerIndex);
				var len=prevPages.length;
				for(i=len-1;i>=0;i--){
					nowPos=parseInt($(obj).children().first().css(init.dir));
					if(prevPages.slice(i,i+1).css("display")=="none"){
						prevPages.slice(i,i+1).show();
						showPageIndex--;
						$(obj).children().first().css(init.dir,nowPos+slimit);
					}
					else{
						break;
					}
				}
				//var betweenPages=$(obj).children().first().slice(showPageIndex+1,pagerIndex);
			}
			if(init.pagerID){
				pager.find(".flipC").removeClass("flipC").addClass("flip");
				pager.children().slice(showPageIndex,showPageIndex+1).removeClass("flip").addClass("flipC");
			}
		}
		if(callBack){
			callBack.call(obj);
		}
	},
	checkTouchAvailabel:function(obj){
		if($(obj).parents("[sliding]").length>0)
			return false;
		else 
			return true;
	}
}