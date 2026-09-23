/*
 *特效类
 */
var SE = {
    promptClick:function(objId){  //提示点击的转动特效
    	var obj = "#"+objId;
    	var slt = "_slt";
    	//圈圈的大小
    	var width = $(obj).css("width")||$(obj).attr("width");
    	var height = $(obj).css("height")||$(obj).attr("height");
    	if(!width){
    		width = 128;
    		height = 128;
    	}
    	width = parseInt(width)+30;  //大小矫正
    	height = parseInt(height)+30;
    	//圈圈的位置
    	var left = $(obj).offset().left;
    	var top = $(obj).offset().top;
    	left = parseInt(left)-15;   //位置矫正
    	top = parseInt(top)-15;
    	var styleStr="position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;overflow: hidden;";
    	var img = "<img id='"+objId+slt+"' class='selectQ' style='"+styleStr+"' src='image/sys/quan5.png'/>";
    	$("body").append(img);
    	$("#"+objId+slt).bind(clickEventType,function(){
    		$(obj).trigger(clickEventType);
    		$("#"+objId+slt).remove();
    	});
    },
    hecheng:function(objId,imgArray,width,time){  //合成
    	var obj = "#"+objId;
    	var slt = "_hcse";
    	//圈圈的位置
    	var left = $(obj).offset().left;
    	var top = $(obj).offset().top;
    	var styleStr="position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+width+"px;overflow: hidden;";
    	var img = "<img id='"+objId+slt+"' style='"+styleStr+"' src='image/sys/se_hecheng/1.png'/>";
    	$("body").append(img);
    	var n = 0;
    	var se_hc = setInterval(function(){
    		$("#"+objId+slt).attr("src","image/sys/"+imgArray[n]);
    		n++;
    		if(n==imgArray.length){
    			n=0;
    		}
    	},100);
    	var time = 100*imgArray.length;
    	setTimeout(function(){
    		clearInterval(se_hc);
    		$("#"+objId+slt).remove();
    	},time)	
    },
    squarePromptClick:function(obj,interval,wCloseId){  //方形转动选择效果
    	var width = $(obj).width()+10;
    	var height = $(obj).height()+10;
    	var left = $(obj).offset().left-5;
    	var top = $(obj).offset().top-5;
    	var newId = obj.id+"prompt";
    	var imgArray = ["se_prompt/f1.png","se_prompt/f2.png","se_prompt/f3.png","se_prompt/f4.png"
    					,"se_prompt/f5.png","se_prompt/f6.png","se_prompt/f7.png"];
    	var styleStr="position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;overflow: hidden;";
    	var img = "<img id='"+newId+"' style='"+styleStr+"' src='image/sys/se_prompt/f1.png'/>";
    	$("body").append(img);
    	var n = 1;
    	interval = setInterval(function(){
    		$("#"+newId).attr("src","image/sys/"+imgArray[n]);
    		n++;
    		if(n==imgArray.length){
    			n=0;
    		}
    	},200);
    	$("#"+newId+",#"+wCloseId).bind(clickEventType,function(){
    		if(this.id==newId){
    			$(obj).trigger(clickEventType);
    		}
    		if(document.getElementById(newId)){
    			$("#"+newId).remove();
    		}
    		if(map.promp){
    			clearInterval(interval);
    		}
    	});
    },
    shake:function(obj){
    	var toRight = setInterval(function(){
            $(obj).css({
                "-moz-transform":"translate(-2px,-2px)",
                "-webkit-transform":"translate(-2px,-2px)",
                "-o-transform":"translate(-2px,-2px)",
                "-ms-transform":"translate(-2px,-2px)",
                "transform":"translate(-2px,-2px)"
            });
        },20);
        var toLeft = setInterval(function(){
            $(obj).css({
                "-moz-transform":"translate(2px,2px)",
                "-webkit-transform":"translate(2px,2px)",
                "-o-transform":"translate(2px,2px)",
                "-ms-transform":"translate(2px,2px)",
                "transform":"translate(2px,2px)"
            });
        },40);
        //清除抖动
        setTimeout(function(){
            clearInterval(toRight);
            clearInterval(toLeft);
            //将图片归位
            $(obj).css({
                "-moz-transform":"translate(0px,0px)",
                "-webkit-transform":"translate(0px,0px)",
                "-o-transform":"translate(0px,0px)",
                "-ms-transform":"translate(0px,0px)",
                "transform":"translate(0px,0px)"
            });
        },500);
    }
}