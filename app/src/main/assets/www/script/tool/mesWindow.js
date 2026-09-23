/*自定义弹出层，加遮罩，本脚本特点是在弹出层上可以继续弹出层并继续遮罩父节点div层。随着关闭最上层，也删除对应的遮罩*
 *初始化>> bbb = new mesWindow("<button id='winClose2'>关闭</button>");
 *关闭该窗口 >> $("#winClose2").live("click",function(){bbb.closeWindow(this);});
 */
var mesWindow = function(winId,conTent,left,top,width,height){
    var isIe=(document.all)?true:false;
    //var myWinArray = [];
    
    var margin_left = left||25;
    var margin_top = top||20;
    var win_width = width||917;
    var win_height = height||515;
    margin_left = (parseInt($("#wraper").width())-win_width)/2;  //让弹窗居中
    margin_top = (parseInt($("#wraper").height())-win_height)/2;  //
    margin_top = (margin_top<0)?20:margin_top;
    var init = function(){
        var back=document.createElement("div");
		back.setAttribute("isback",true);
        back.id="windowBack"+winId;
        var styleStr="position:fixed;top:0px;left:0px;background:#000000;width:100%;height:100%;";
		if(!document.body.querySelector("div[isback]")){
			styleStr+="opacity:0.5";
		}
		else{
			styleStr+="opacity:0.5";
		}
        back.style.cssText=styleStr;
        document.body.appendChild(back);
        //初始化弹出窗
        var mesW=document.createElement("div");
        mesW.id = winId;
        mesW.className="mesWindow";
        mesW.innerHTML=conTent;
        if(winId=="battleWindow"){
        	styleStr="position:absolute;top:0px;left:"+margin_left+"px;width:1024px;height:"+win_height+"px;";
        }else{
        	styleStr="position:fixed;top:50px;left:"+margin_left+"px;width:"+win_width+"px;height:"+win_height+"px;";
        }
        mesW.style.cssText=styleStr;
        document.body.appendChild(mesW);
    }
    //显示遮罩层
    function showBackground(obj,endInt){
        if(isIe){
            obj.filters.alpha.opacity+=1;
            if(obj.filters.alpha.opacity<endInt){
                setTimeout(function(){
                    showBackground(obj,endInt)
                },5);
            }
        }else{
            var al=parseFloat(obj.style.opacity);
            al+=0.01;
            obj.style.opacity=al;
            if(al<(endInt/100))
            {
                setTimeout(function(){
                    showBackground(obj,endInt)
                },5);
            }
        }
    }
    //关闭弹出窗
    this.closeWindow = function(btnClose){
        var winID= $(btnClose).parents(".mesWindow").attr("id");
        $(btnClose).parents(".mesWindow").remove();
        $("#windowBack"+winId).remove(); //删除遮罩
        //$(myWinArray.pop()).remove();  //删除最顶层的遮罩
    }
    return init();
}
mesWindow.closeWindowById=function(winID){
    if($("#"+winID).hasClass("mesWindow")){
        $("#"+winID).remove();
        $("#windowBack"+winID).remove();
    }
}

function autoHideWindow(){};
autoHideWindow.createWindow=function(strText,width,height){
    var winObj=jQuery("<div class='dialogB bor15' style='min-height:0px;text-align:center;opacity:1.0;position:absolute;'>"+strText+"</div>");
    if(width!=undefined)
        winObj.css("width",width+"px");
    if(height!=undefined)
        winObj.css("height",height+"px");
    var bodyWidth=$(document).width();
    var bodyHeight=$(document).height();
    var thisWidth=winObj.width();
    var thisHeight=winObj.height();
    var top=parseInt((bodyHeight-thisHeight)/2);
    var left=parseInt((bodyWidth-thisWidth)/2);
    winObj.css({
        top:top+"px",
        left:left+"px"
        }).appendTo("body");
        
    setTimeout(function(){
        var intervalID=setInterval(function(){
            opacity=winObj.css("opacity");
            opacity=(parseInt(opacity*10)-2)/10;
            if(opacity<=0)
            {
                winObj.remove();
                clearInterval(intervalID);
            }
            else{
                winObj.css("opacity",opacity);
            }
        },100);
    },1000)
    
}
