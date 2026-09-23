var host ="115.29.14.233/";
var userId=0;//window.prompt("请输入用户ID","");
var dayType="a";//白天
//var imgfolder="file:///android_asset/image/game/";
//var imgfolder2="file:///android_asset/image/sys/";
var imgfolder="/image/game/";
var imgfolder2="/image/sys/";
var clickEventType=((document.ontouchstart!==null)?'click':'touchend');
var isMobile = true;
var touchDown = "touchstart";
var touchMove = "touchmove";
var touchUp = "touchend";
var touchOut = "mouseout";
var directorImg = "";
var getEventX = function (e) {
	if(e.touches.length>0){
		return e.touches[0].pageX;
	}
	else if(e.changedTouches.length>0){
		return e.changedTouches[0].pageX;
	}
}
var getEventY=function(e){
	if(e.touches.length>0){
		return e.touches[0].pageY;
	}
	else if(e.changedTouches.length>0){
		return e.changedTouches[0].pageY;
	}
}
if (document.ontouchstart !== null) {//pc
    touchDown = "mousedown";
    touchMove = "mousemove";
    touchUp = "mouseup";
    touchOut = "mouseout";
    isMobile = false;
    getEventX = function (e) {
        return e.pageX ? e.pageX : e.x;
    }
	getEventY=function(e){
		return e.pageY ? e.pageY : e.y;
	}
}
else{//移动
	$(window).bind("orientationchange",function(){Common.checkOrientation();});//绑定横竖屏事件
}
//css3动画事件
var animationEnd=(
	$.browser.webkit?"webkitAnimationEnd":(
		$.browser.mozilla?"animationend":(
			$.browser.msie?"MSAnimationEnd":($.browser.opera?"oAnimationEnd":"animationend")
		)
	)
);
var transitionEnd=(
	$.browser.webkit?"webkitTransitionEnd":(
		$.browser.mozilla?"transitionend":(
			$.browser.msie?"MSTransitionEnd":($.browser.opera?"oTransitionEnd":"transitionend")
		)
	)
);

//jQuery 扩展(获取数据时添加loading提示)
// Android 改造：当 URL 包含 sgg/i/ 时，走 SgBridge（Kotlin 后端）
// 其他走真实 HTTP
$.getJN=function(url,obj,callBack,id){
	var param={hasData:false};

	// Android SgBridge 路由
	if(typeof SgBridge !== 'undefined' && url.indexOf('sgg/i/') >= 0) {
		try {
			var data = routeToSgBridge(url, obj);
			param.hasData = true;
			closeLoading2();
			if(data && data.user){
				user.refreshUserInfo(data.user);
			}
			callBack(data);
		} catch(e) {
			closeLoading2(1);
		}
		return;
	}

	var r_num = new Date().getTime().toString();
	setTimeout(showLoading,800,param);
	$.ajax({
		type:"POST",
		url:url+"?t="+r_num,
		data:obj,
		dataType:"text",
		cache:false,
		timeout:60000,
		success:function(data2){
			if(data2!=""){
				data=$.parseJSON(data2);
				param.hasData=true;
				closeLoading2();
				if(data&&data.user){
					user.refreshUserInfo(data.user);
				}
			}
			callBack(data);
		},
		error:function(){
			closeLoading2(1);
		}
	});
}

// 路由表：URL → SgBridge 方法
function routeToSgBridge(url, obj) {
	// 战斗
	if(url.match(/sgg\/i\/fight\/(f|s)\.php/)) {
		var formation = obj.field || obj.formation || '0,0,0|0,0,0|0,0,0';
		var sysIds = obj.sys || obj.sys_ids || '0,0,0|0,0,0|0,0,0';
		return $.parseJSON(SgBridge.battleFight(formation, sysIds));
	}
	// 用户
	if(url.match(/sgg\/i\/user\/(z|u|get|info)\.php/)) {
		return $.parseJSON(SgBridge.userGetInfo());
	}
	// 武将
	if(url.match(/sgg\/i\/npc\/list\.php/)) {
		return {npcs: $.parseJSON(SgBridge.npcList())};
	}
	// 装备
	if(url.match(/sgg\/i\/equip\/list\.php/)) {
		return {equips: $.parseJSON(SgBridge.equipList())};
	}
	// 任务
	if(url.match(/sgg\/i\/task\/list\.php/)) {
		return {tasks: $.parseJSON(SgBridge.taskList())};
	}
	if(url.match(/sgg\/i\/task\/complete\.php/)) {
		SgBridge.taskComplete(parseInt(obj.task_id || obj.id));
		return {ok:true};
	}
	// 强化
	if(url.match(/sgg\/i\/qianghua\//)) {
		var cost = SgBridge.qianghuaCalc(parseInt(obj.level||0), parseInt(obj.type||1));
		return {cost: cost, ok: true};
	}
	// 默认：返回空成功
	return {ok: true};
}
function showLoading(param){
	if(!param.hasData){
		var height=$("#wraper").height();
		var width=$("#wraper").width();
		var top=(height-79-100)/2;
		var left=(width-79)/2;
		var div=$("<div style='position:absolute;width:"+width+"px;height:"+height+"px;top:0px;left:0px;'><div style='position:absolute;top:"+top+"px;left:"+left+"px;text-align:center;' class='fs20 cor3'><img id='loadingImg' src='image/sys/loading.png' class='rotate360' /></div></div>");
		$("body").append(div);
		/*mainPage.playAnimation("loadingImg",[{url:"image/sys/loading1.png",nextT:150},{url:"image/sys/loading2.png",nextT:150},{url:"image/sys/loading3.png",nextT:150},{url:"image/sys/loading4.png",nextT:150}],0,0);*/
		setTimeout(closeLoading2,10000,1);
	}
}
function closeLoading2(error){
	if(error){
		var parent=$("#loadingImg").parent();
		$("#loadingImg").remove();
		parent.css({"left":"0px",width:"100%"}).text("您的网络不给力，请求失败");
		setTimeout(function(){parent.parent().remove();},2000);
	}
	else{
		$("#loadingImg").parent().parent().remove();
	}
}

//封装部分原始类公式的方法
var Common = {
	getColorByClass:function(wjclass){  //根据npc品质获取颜色
		//c_color[0]本身不存在
		var c_color = new Array("#000000","#FDFFFD","#4CFF00","#2107E5","#AF02FF","#FB7405","#FF0000");
		return c_color[wjclass];
	},
	getClassByClass:function(wjclass){
		//c_color[0]本身不存在
		var c_class = new Array("stro15","stro15","stro16","stro14","stro17","stro18","stro19");
		return c_class[wjclass];
	},
	closeWindow:function(obj){
		$(document).unbind(touchDown);
		if(obj){
			var win=obj.parents(".mesWindow");
		}else{
			var win=$(this).parents(".mesWindow");
		}
		mesWindow.closeWindowById(win.attr("id"));
		DialogLevel=0;
		if(Common.closeWinCallBack!=undefined && Common.closeWinCallBack[win.attr("id")]){
			Common.closeWinCallBack[win.attr("id")]();
			delete Common.closeWinCallBack[win.attr("id")];
		}
	},
	closeAllWindow:function(){
            $(document).unbind(touchDown);
		if($(this).hasClass("oneclose")){
                    $("#elite_s_list").find(".saodang").attr('style', 'display:none');
                    $("#elite_s_list").find(".saodang").removeAttr('id');
                    $("#elite_s_list").find(".zhandou").attr('style', 'display:none');
                    $("#elite_s_list").find(".zhandou").removeAttr('id');
                    $("#smap_list").find(".saodang").attr('style', 'display:none');
                    $("#smap_list").find(".saodang").removeAttr('id');
                    $("#smap_list").find(".zhandou").attr('style', 'display:none');
                    $("#smap_list").find(".zhandou").removeAttr('id');
                    var win=$(this).parents(".mesWindow");
                    if ($(this).attr("map_id")) {
                        $("#elite_list").removeAllItem();
                        elite.showEliteList();
                    }
                    Common.closeWindow.call(this);
		}
		else{
			DialogLevel=0;
			$(".x").each(function(){
				var win=$(this).parents(".mesWindow");
				mesWindow.closeWindowById(win.attr("id"));
				if(Common.closeWinCallBack!=undefined && Common.closeWinCallBack[win.attr("id")]){
					Common.closeWinCallBack[win.attr("id")]();
					delete Common.closeWinCallBack[win.attr("id")];
				}
			});
		}
		if(director.progress>0){
			director.updateProgress();
		}
	},
	injectCloseCallBack:function(callBack,id){//注入关闭时要调用的方法
		if(typeof Common.closeWinCallBack=="undefined"){
			Common.closeWinCallBack=new Array();
		}
		Common.closeWinCallBack[id]=callBack;
	},
	Tab:{
		//tabID:tab所在的parent的id,tabConID:与tab关联的内容的id
		bindTab:function(tabID,tabConID){
			var args=arguments;
			$("#"+tabID).attr("forcon",tabConID).children().each(function(i){
				$(this).bind(clickEventType,function(){
					var selectedNow=$(this).parent().find(".over");
					if(selectedNow.get(0)==this){//当前显示tab为点击的tab
						return;
					}
					if(selectedNow.attr("clickImg")!=undefined){
						var removeImg=selectedNow.removeClass("over").attr("src");
						var clickImg=selectedNow.attr("clickImg");
						selectedNow.attr("src",clickImg).attr("clickImg",removeImg);
					}
					$(this).addClass("over");
					if($(this).attr("clickImg")!=undefined){
						var removeImg=$(this).attr("src");
						var clickImg=$(this).attr("clickImg");
						$(this).attr("src",clickImg).attr("clickImg",removeImg);
					}
					var tabIndex=$(this).index();
					var conID=$(this).parent().attr("forcon");
					if(conID!=undefined&&conID!=""){
						var container=$("#"+conID);
						if($(this).attr("forid")==undefined){
							var tab=container.children().slice(tabIndex,tabIndex+1);
						}
						else{
							var tab=container.find("#"+$(this).attr("forid"));
						}
						if(tab.length>0){
							container.children(":visible").hide();
							tab.show();
							if(this.onTabChanged && !tab.attr("hasData")){
								this.onTabChanged();
							}
						}
					}
					else{
						if(this.onTabChanged){
							this.onTabChanged();
						}
					}
				})
				
				if(args[i+2]!=undefined){
					this.onTabChanged=args[i+2];
				}
			});
		},
		setHasData:function(id){
			$("#"+id).attr("hasData",true);
		},
		setHasNodata:function(id){
			$("#"+id).removeAttr("hasData",true);
		}
	},
	a:function(){
		alert(1111111);
	},
	//alert:function(str,callBack,callBackData,showCZ){
	/*
	 * @content string example:出售 <span class="cor95 stro13">追云靴</span> 获得<span class="cor95">100金币</span>
	 * @type int 0 关闭按钮  1 确定和关闭按钮同时存在  2 充值 和关闭按钮  3 查看vip和 关闭按钮
	 * @action 点击关闭按钮之外的按钮 将要进行的操作  例：Common.a
	 */
	alert:function(content,type,action,param){
		var btn='';
		if(!type){//弹窗只有关闭按钮
			btn = '<a class="pub_btn" style="margin-left:220px;" id="alertClose">关闭</a>';
		}
        else if(type==1){ //弹窗  确定  关闭按钮
        	btn = '<a class="pub_btn" id="btn_ok">确定</a><a class="pub_btn" id="alertClose">关闭</a>';
		}else if(type==5){ //弹窗 确定   摇钱树专用
			btn = '<a class="pub_btn" id="btn_ok_1">确定</a><a class="pub_btn" id="alertClose">关闭</a>';
		}else if(type==4){
			btn = '<a class="pub_btn" id="btn_yao_money">摇钱树</a><a class="pub_btn" id="alertClose">关闭</a>';
		}
        else if(type==2){ //弹窗 充值  关闭按钮
        	btn = '<a class="pub_btn" id="btn_yao_money">去充值</a><a class="pub_btn" id="alertClose">关闭</a>';
		}
        else if(type==3){ //弹窗查看vip 关闭
        	btn = '<a class="pub_btn" id="btn_money">查看vip</a><a class="pub_btn" id="alertClose">关闭</a>';
		}
        else if(type==9){ //guanbi
        	btn = '<a class="pub_btn" style="margin-left:220px;" id="alertClose">关闭</a>';
		}
        else{ //暂时保留为以后增加新的弹窗预留
        	btn = '<a class="pub_btn" style="margin-left:220px;" id="directorClose">关闭</a>';
		}
		//var winPromp = new  mesWindow("winPromp","<div class='pubPop1 pab'><p class='fs28 cor55'>"+content+"</p><div class='mt83'>"+btn+"</div></div>");
		var winPromp = new  mesWindow("winPromp","<div class='pubPop1 pab'><p class='fs28 cor55'>"+content+"</p><div class='mt83'>"+btn+"</div></div>");
		$('#alertClose').bind(clickEventType,function(){
		    winPromp.closeWindow(this);
			if(type==9){
               $("#elite_list").removeAllItem();
               elite.showEliteList();
			}
		});
		$('#btn_ok').bind(clickEventType,function(){
			winPromp.closeWindow(this);
			if(!param){
				action();
			}else{
				action(param);
			}
		});
		$('#btn_yao_money').bind(clickEventType,function(){
			winPromp.closeWindow(this);
			action();
		});
		$('#directorClose').bind(clickEventType,function(){
			winPromp.closeWindow(this);
			if(director.progress>0){
				$("#windowBackzmWindow,#windowBackjtWindow").remove();
				director.updateProgress();
			}
		});
		$('#btn_ok_1').bind(clickEventType,function(){
			winPromp.closeWindow(this);
			action();
		});
		$('#btn_money').bind(clickEventType,function(){
			winPromp.closeWindow(this);
			action();
		});
		$('#btn_vip').bind(clickEventType,function(){
			winPromp.closeWindow(this);
			action();
		});
		/*$('#yaoqianshu').bind(clickEventType,function(){
			winPromp.closeWindow(this);
			action();
		});
		if(showCZ){
			$("#btnPrompCZ").show();
		}
		$("#btnPrompOK").bind(clickEventType, function() {
            winPromp.closeWindow(this);
			if(callBack){
				callBack.call(thisObj,callBackData);
			}
			$("#btnPrompOK,#btnPrompCZ").unbind(clickEventType);
        });
        $("#btnPrompCZ").bind(clickEventType,function(){
        	log("充值按钮点击");
        	winPromp.closeWindow(this);
        	$("#btnPrompOK,#btnPrompCZ").unbind(clickEventType);
        });
        */
	},
	/*
	 * 显示背包物品详细信息公共弹窗
	 */
	bAlert:function(){
		var winPromp = new  mesWindow("bAlert",html);
	},
	confirm:function(str,callBack,callBackData){
		var winConfirm = new mesWindow("winConfirm", "<div class='bakO pab'><div class='bakT tc fs24 cor3'>"+str+"</div>"+
        "<div class='bakB'><a id='btnConfirmOK' class='btn16' style='margin-right: 15px;float: right;'>确定</a><a id='btnConfrimCancel' class='btn16' style='margin-right: 15px;float: right;'>取消</a></div></div>");
		var thisObj=this;
		$("#btnConfirmOK").bind(clickEventType, function() {
            winConfirm.closeWindow(this);
			if(callBack){//点击确定后的回调函数
				callBack.call(thisObj,callBackData);
			}
        });
		$("#btnConfrimCancel").bind(clickEventType, function() {
            winConfirm.closeWindow(this);
        });
	},
	userVipInfo:function(){
		var v = {
		        };
		return v;
	},
	getLoadingInfo:function(){
		var v = {
			
			};
		return v;
	},
	isPrompted:0  //是否已经提示过翻转
	,
	checkOrientation:function(){
		var promWindow = null;
		
		 if(window.orientation!=undefined){
			orient = Math.abs(window.orientation);
			//alert(orient+" ");
			if(orient!==90){
				if(!document.getElementById("screenZhezhao")){
					promWindow = $("<div class='zhezhao' id='screenZhezhao'><img src='image/sys/screen.jpg'></div>");
					$("body").append(promWindow);
				}
			}
			else{
				//删除过程添加过度，否则在pad设备可能出现显示问题
				$("#screenZhezhao").fadeOut("slow",function(){
				   	$("#screenZhezhao").remove();
				});
			}
		} 
		 else{
			if(Common.isPrompted){
				return false;
			}
			if(window.innerWidth<window.innerHeight){
				if(!document.getElementById("screenZhezhao")){
					promWindow = $("<div class='zhezhao' id='screenZhezhao'><img src='image/sys/screen.jpg'></div>");
					$("body").append(promWindow);
				}
			}
			else{
				$("#screenZhezhao").fadeOut("slow",function(){
				   	$("#screenZhezhao").remove();
				   	Common.isPrompted = 1;
				});
				
			}
		 }
	},
	getLargestClassByCan:function(can){  //根据武将的can值获取该武将的最大品阶
		var npcClass = {"1":6,"2":6,"3":6,"4":6,"5":6,"6":6,"7":6,"8":5,"9":6,
		                "10":5,"11":6,"12":6,"13":6,"14":6,"15":5,"16":5,"17":5,"18":5};
		if(npcClass[can]){
			return npcClass[can];
		}else{
			return 1;
		}
	},
	setNpcClassStar:function(obj,can,c_class){  //设置武将品阶星星显示
		obj.empty();
	    obj.css("font-size","0px");
//	    var can = parseInt(can);
	    var c_class = parseInt(c_class);
	    //var largestClass = Common.getLargestClassByCan(can);
	    for(var i=0;i<c_class;i++){
//            if(i<c_class){
                obj.append("<img src='image/sys/zStar.png'>");
//            }else{
//                obj.append("<img src='image/sys/zStar1.png'>");
//            }
        }
	},
	getLongAttrName:function(attrn){
        var names={"hp":"血上限","phy_att":"物理攻击","phy_def":"物理防御","mag_att":"法术攻击","mag_def":"法术防御","speed":"速 度","strength":"力 量","intelligence":"智 力","crit":"暴 击","crit_def":"抗 暴","hit":"命 中","miss":"闪 避","fury":"怒 气"};
        return names[attrn];
    },
	initGamescreen:function(){
    	var dd = $("#main_icon").offset();
    	console.log(dd.top)
    	if(dd.top<476){
    		var h = (476-dd.top)*2;
    		if(h>150){
    			h=150;
    		}
    		h+=1024;
    	    //alert(h);
    		$("body").css("width",h+"px");
    	}
    }
}
//pc上阻止网页内容被拖拽
if(!isMobile){
	//阻止事件冒泡
	var stopBubble=function(e){
		if(!$(e.target).attr("contenteditable")){
			e.preventDefault();
			e.cancelBubble = true;
			return false;
		}
	}
	document.addEventListener("selectstart",function(e){
		
	});
	document.onselectstart=stopBubble;//阻止选中内容
	document.ondragstart=stopBubble;//阻止拖拽
}
function log(str){
	console.log(str);
}
//

//加载资源类

ResLoad={
	wait_run:null,
	info_run:null,
	se2:0,
	resourceLoader:function(res,callback,se2){
		var loading = $($("#loading").html());
		if(se2){
			ResLoad.se2 = se2;
			loading = loading.find("#myloading2").show();
		}
		
		$("body").append(loading);
		if(!se2){
			var info_array = Common.getLoadingInfo();
			this.info_run = setInterval(function(){
				var random = Math.floor(Math.random()*9)+1;   //1-10的随机数
				$("#loadingInfo").html(info_array[random]);
			},3000);
		}
		var l_id = (se2)?"myloading2":"myloading";
		document.getElementById(l_id).addEventListener('touchmove', function(e) {
		    e.stopPropagation();
		    e.preventDefault();
		});
		this.load(res,callback);
		this.wait_run = setTimeout(function(){
			if(document.getElementById("myloading")||document.getElementById("myloading2")){
				$("#myloading,#myloading2").remove();
				ResLoad.index = 0;
				ResLoad.se2 = 0;
				if(ResLoad.info_run){
					clearInterval(ResLoad.info_run);
				}
				if(callback){
					callback();
				}
			}
		},120000);  //120000秒不能加载完成则自动跳出
	},
	index:0
	,
	load:function(res,callback){
		if(!document.getElementById("myloading")&&!document.getElementById("myloading2")){
			return false;
		}
		var length = res.length;   //资源总长度
		//自动循环
		var re = res[ResLoad.index];
		var img = new Image();
		img.src = re;
		img.addEventListener("load",function(){
		//$(document).load(re,function(){
			if(ResLoad.animate(length,ResLoad.index+1)){
				ResLoad.index++;
				ResLoad.load(res,callback);  //通过递归实现图片或者脚本逐个加载
			}else{
				if(callback){
					callback();
				}	
			}
		});

	},
	animate:function(length,progress){	
		//血条长度660px
		var longl = Math.floor(660*(progress/length));
		var percent = Math.floor(100*(progress/length));
		if(ResLoad.se2){
			$("#myloading2 span").text(percent+"%");
			$("#myloading2 .nBlood").css("width",Math.floor(290*(progress/length))+"px");
		}else{
			$("#myloading .pressBtn").css("width",longl+"px");
			$("#myloading .load_num").html(percent+"%");
		}
		if(length==progress){
			if(ResLoad.wait_run){
				clearTimeout(ResLoad.wait_run);
			}
			if(ResLoad.info_run){
				clearInterval(ResLoad.info_run);
			}
			$("#myloading,#myloading2").remove();
			ResLoad.index = 0;
			ResLoad.se2 = 0;
			return 0;
		}else{
			return 1;
		}
	}
}
