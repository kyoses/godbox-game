/*
 * 新手引导相关代码
 */
var director={
	directorImg:'',
	progress:0,
	flag:0,
	myselect:null,
	//新手性别选择
	showSex:function(){
		$("#wraper").hide();
		mesWindow.closeWindowById("loginWindow");//关闭登录弹窗
		$("body").append($("#newUser_sex").html());
		$(".sSex").bind(clickEventType,function(){
			$("#new_sex").remove();
			director.showInputName($(this).attr("sex"),$(this).attr("simg"));
		});
	},
	//新手输入名字
	showInputName:function(sex,usersImg){
		director.directorImg = usersImg;
		$("body").append($("#newUser_name").html());
		$("#newUser_img").attr("src",usersImg);
		$("#newUser_back").bind(clickEventType,function(){
			$("#new_name").remove();
			director.showSex();
		});
		$("#random_name").bind(clickEventType,function(){//随机名字
			$.getJN("http://" + host + "/sgg/i/top/s.php", {
				gender:sex
			}, function(data) {
				$("#newInput_name").val(data.rname);
			});
		});
		$("#name_sub").bind(clickEventType,function(){
			if($(this).attr("ckicking")==true){//防止多重点击
				return false;
			}
			else{
				$(this).attr("clicking",true);
			}
			var name=$.trim($("#newInput_name").val());
			if(name==""){
				Common.alert("请输入玩家 <span class='cor95 stro13'>名称</span>");
				$(this).removeAttr("clicking");
				return false;
			}
			if(name.length>8){
				Common.alert("名字请限制在8个字以内");
				$(this).removeAttr("clicking");
				return false;
			}
			$.getJN("http://" + host + "/sgg/i/top/c.php", {
				name : name,
				sex:sex,
				uimg:usersImg,
				acc_id:acc_id,
				acc_type:acc_type,
				plat_info:plat_info
			}, function(data) {
				if(parseInt(data.st)==1){
					$("#new_name").remove();
					userId=data.id;
					$('#ybNum').attr("yb_total",data.yb_total);
					user.refreshUserInfo(data,1);
					data.nt = data.nt||0;
					tiLi.startRefresh(data.nt);
					//director.startDirect(1);
					director.showdddd1();
				}
				else if(parseInt(data.st)==3){
					Common.alert("此玩家名称 <span class='cor95 stro13'>存在非法字符</span>");
					$("#name_ok").removeAttr("clicking");
				}
				else if(parseInt(data.st)==2){
					Common.alert("此玩家名称 <span class='cor95 stro13'>已存在</span>");
					$("#name_ok").removeAttr("clicking");
				}
			});
		});
	},

	showdddd1:function(){
		$("#wraper").hide();
		mesWindow.closeWindowById("loginWindow");//关闭登录弹窗
		$("body").append($("#newUser_ddddd1").html());
		$("#name_subzzz1").bind(clickEventType,function(){
				parent.$("newUser_ddddd1").remove();
				console.log("去掉上1层");
				director.showdddd2();
			});
		 
	},
	showdddd2:function(){
		 
		$("#new_sex1").remove();
		//$("#newUser_ddddd1").hide();
		//$("#wraper").hide();
		//mesWindow.closeWindowById("loginWindow");//关闭登录弹窗
		$("body").append($("#newUser_ddddd2").html());
		$("#name_subzzz2").bind(clickEventType,function(){
				console.log("test");
				director.showdddd3();

			});
		 
	},
	showdddd3:function(){
		$("#wraper").hide();
		$("#new_sex2").remove();
		mesWindow.closeWindowById("loginWindow");//关闭登录弹窗
		$("body").append($("#newUser_ddddd3").html());
		$("#name_subzzz3").bind(clickEventType,function(){
				director.showdddd4();

			});
		 
	},

	showdddd4:function(){
		$("#wraper").hide();
		$("#new_sex3").remove();
		mesWindow.closeWindowById("loginWindow");//关闭登录弹窗
		$("body").append($("#newUser_ddddd4").html());
		$("#name_subzzz4").bind(clickEventType,function(){
				director.showdddd5();

			});
		 
	},

	showdddd5:function(){
			$("#new_sex4").remove();
		$("#wraper").hide();
		mesWindow.closeWindowById("loginWindow");//关闭登录弹窗
		$("body").append($("#newUser_ddddd5").html());
		$("#name_subzzz5").bind(clickEventType,function(){
				director.startDirect(1);

			});
		 
	},
//
//	showdddd6:function(){
//		$("#wraper").hide();
//		mesWindow.closeWindowById("loginWindow");//关闭登录弹窗
//		$("body").append($("#newUser_ddddd6").html());
//		$("#name_subzzz6").bind(clickEventType,function(){
//				director.startDirect(1);
//
//			});
//		 
//	},
	//开启新手引导
	startDirect:function(progress){
		var directorInfo=directorPlugins[progress];//调用新手指导插件是第几步
		if(progress==1){ //新手指引第一步
			if(directorInfo.start){
				var len = directorInfo.start.length;
				for(var i=0;i<len;i++){
					directorInfo.start[i].fun();
				}
				director.progress = ++progress;//将当前progress保存成全局变量 记录执行的第几次对话
				director.startDirect(director.progress);//直接调用新手引导的第二步
			}
		}else{
			director.progress = progress;
			var len = directorInfo.start.length;
			for(var i=0;i<len;i++){
				directorInfo.start[i].fun();
			}
		}
	},
	//移除公共部分黑色透明背景 蒙层
	removeBack:function(){
		$('#directorBack').remove();
		$('#directorCon1').remove();
	},
	removeCommonBack:function(){
		$('#directorBack').remove();
		$('body>.commonBack').remove();
	},
	background:function(obj,index){
		director.removeCommonBack();
		//默认页面大小 1024*820
		var obj_width = parseInt(obj.width());
		var obj_height = parseInt(obj.height());
		var obj_left = parseInt(obj.offset().left);
		var obj_top = parseInt(obj.offset().top);
		log(obj_width+" "+obj_height+" "+obj_left+" "+obj_top+" "+JSON.stringify(obj.offset()));
		var commonback1 = "<div class='directorBack1 commonBack' style=' width:1024px;height:"+obj_top+"px;top:0px;left:0px;'></div>";
		var commonback2 = "<div class='directorBack2 commonBack' style=' width:"+obj_left+"px;height:"+obj_height+"px;top:"+obj_top+"px;left:0px;'></div>";
		var commonback3 = "<div class='directorBack3 commonBack' style=' width:"+(1024-obj_width-obj_left)+"px;height:"+obj_height+"px;top:"+obj_top+"px;left:"+(obj_width+obj_left)+"px;'></div>";
		var commonback4 = "<div class='directorBack4 commonBack' style=' width:1024px;height:"+(820-obj_top-obj_height)+"px;top:"+(obj_top+obj_height)+"px;left:0px;'></div>";
		if(index){
			var timeOne = setInterval(function(){
				if(obj.html()){
					clearInterval(timeOne);
					$("body").append(commonback1).append(commonback2).append(commonback3).append(commonback4);
				}
			},100);
		}else{
			$("body").append(commonback1).append(commonback2).append(commonback3).append(commonback4);
		}
	},
	//新手引导对话公共弹框
	showDialog:function(){
		director.removeBack();
		director.removeCommonBack();
		var conDialog='';
		var conDir='';
		var DialClass='';
		var main=directorPlugins[director.progress];//拿到当前新手指导执行到第几步获取相应的数据
		if(main.del==true){
			$("#smap_list div:eq(0) ul:eq(0)").find(".mapPointer").remove();
		}else{
			$(main.del).remove();
		}
		if(main.del1){
			$(main.del1).find(".mapPointer").remove();
		}
		if(main.DialogLevel==true){
			DialogLevel=0;
		}
		if(main.BS=="small"){
			DialClass="xinshou_pop2";
		}else{
			DialClass="xinshou_pop1";
		}
		if(main.delEvent){
			$(main.delEvent).unbind(clickEventType);
		}
		var commonImg = director.directorImg;//获取到用户角色头像
		if(main.conDir=='Left'){
			conDir="conDirLeft";
			commonImg="image/sys/xs_girl.png";
			conDialog=$('<div id="directorCon1" class="'+DialClass+' spfz" style="z-index:20; position:fixed; bottom:'+main.pos.top+'px;left:'+main.pos.left+'px"><img src="'+commonImg+'" width="168px" height="180px" /><p class="spfz">'+main.content+'</p><a class="text fs24 fl spfz"><img src="image/sys/d.png" /></a></div>');
		}else{
			conDir='';
			conDialog=$('<div id="directorCon1" class="'+DialClass+' '+conDir+'" style="z-index:20;position:fixed; bottom:'+main.pos.top+'px;left:'+main.pos.left+'px"><img src="'+commonImg+'" class="spfz" width="168px" height="180px" /><p>'+main.content+'</p><a class="text fs24 fr"><img src="image/sys/d.png" /></a></div>');
		}
		$("body").append(conDialog);
		if(!main.obj){ //如果没有需要在遮罩中显示的
			var commonBack = "<div id='directorBack' style='position:fixed; z-index:10px; background:#000000; filter:alpha(opacity=50);opacity:0.5; width:1024px;height:100%;top:0px;left:0px;'></div>";
			$("body").append(commonBack);
		}else{
			//默认页面大小 1024*820
			if(main.obj=="#smap_list div:eq(0)"){  //处理战斗页面新手引导特殊功能 单独修改
				if(main.isShow==true){
					$("#smap_list div:eq(0) ul:eq(0)").find(".mapPointer").remove();
					$("#smap_list div:eq(0) ul:eq(0)").unbind(clickEventType);
					$("#smap_list div:eq(0) ul:eq(2)").unbind(clickEventType);
					$("#smap_list div:eq(0) ul:eq(1) li:eq(1)").empty();
					$("#smap_list div:eq(0) ul:eq(1) li:eq(3)").hide();
					var obj2 = $(main.obj+" ul:eq(2)");
					$(obj2).find(".mt187").empty();
					$(obj2).find("li:eq(0)").append('<img width="100" height="128" src="image/game/lvbuh.png" style="margin:-25px 0 0 8px;">');
					$(obj2).find("li:eq(2)").html("吕布");
					$(obj2).find("li:eq(0) img:gt(0)").remove();
				}else{
					if(main.isThree==true){
						$("#smap_list div:eq(0) ul:eq(0)").find(".mapPointer").remove();
						$("#smap_list div:eq(0) ul:eq(0)").unbind(clickEventType);
						$("#smap_list div:eq(0) ul:eq(1)").unbind(clickEventType);
						$("#smap_list div:eq(0) ul:eq(2) li:eq(1)").empty();
						$("#smap_list div:eq(0) ul:eq(2) li:eq(3)").hide();
						var obj2 = $(main.obj+" ul:eq(2)");
						var obj2 = $(main.obj+" ul:eq(1)");
						$(obj2).find("li:eq(0) img:gt(0)").remove();
						$(obj1).find("li:eq(0) img:gt(0)").remove();
					}else if(main.isThree=="trueone"){  //新手指引第一次战斗处理
						$(main.obj+" ul:eq(0)").find(".mapPointer").remove();
						$(main.obj+" ul:eq(0)").append('<img class="mapPointer" src="image/sys/map_arrow.png">');
						$("#smap_list div:eq(0) ul:eq(0) li:eq(1)").empty();
						$("#smap_list div:eq(0) ul:eq(0) li:eq(3)").hide();
						$("#smap_list div:eq(0) ul:eq(1)").unbind(clickEventType);
						$("#smap_list div:eq(0) ul:eq(2)").unbind(clickEventType);
						var obj1 = $(main.obj+" ul:eq(1)");
						var obj2 = $(main.obj+" ul:eq(2)");
						$(obj1).find(".mt187").empty();
						$(obj1).find("li:eq(0)").append('<img width="100" height="128" src="image/game/npc/z9.png" style="margin:-25px 0 0 8px;">');
						$(obj1).find("li:eq(2)").html("后军部队");
						$(obj2).find(".mt187").empty();
						$(obj2).find("li:eq(0)").append('<img width="100" height="128" src="image/game/npc/22.png" style="margin:-25px 0 0 8px;">');
						$(obj2).find("li:eq(2)").html("吕布");
						$(obj1).find("li:eq(0) img:gt(0)").remove();$(obj2).find("li:eq(0) img:gt(0)").remove();
					}
					else{
						$(main.obj+" ul:eq(0)").find(".mapPointer").remove();
						$(main.obj+" ul:eq(0)").append('<img class="mapPointer" src="image/sys/map_arrow.png">');
						var obj1 = $(main.obj+" ul:eq(1)");
						var obj2 = $(main.obj+" ul:eq(2)");
						$(obj1).find(".mt187").empty();
						$(obj1).find("li:eq(0)").append('<img width="100" height="128" src="image/game/npc/z9.png" style="margin:-25px 0 0 8px;">');
						$(obj1).find("li:eq(2)").html("后军部队");
						$(obj2).find(".mt187").empty();
						$(obj2).find("li:eq(0)").append('<img width="100" height="128" src="image/game/npc/22.png" style="margin:-25px 0 0 8px;">');
						$(obj2).find("li:eq(2)").html("吕布");
					}
				}
			}
			var obj = $(main.obj);
			
			//alert(obj.html());
			var obj_width = parseInt(obj.width());
			var obj_height = parseInt(obj.height());
			if(!main.posBack){
				if(obj.offset()){
					var obj_left = parseInt(obj.offset().left);
					var obj_top = parseInt(obj.offset().top);
				}
			}else{
				var obj_left=main.posBack.left;
				var obj_top = main.posBack.top;
			}
			if(main.setWH==1){
				var obj_width = parseInt(141);
				var obj_height = parseInt(188);
			}
			if(main.setWH==2){
				var obj_width = parseInt(108);
				var obj_height = parseInt(126);
			}
			if(main.setWH==3){
				var obj_width = parseInt(66);
				var obj_height = parseInt(66);
			}
			if(main.setWH==4){
				var obj_width = parseInt(86);
				var obj_height = parseInt(86);
			}
			log(obj_width+" "+obj_height+" "+obj_left+" "+obj_top+" "+JSON.stringify(obj.offset()));
			var commonback1 = "<div class='directorBack1 commonBack' style=' width:1024px;height:"+obj_top+"px;top:0px;left:0px;'></div>";
			var commonback2 = "<div class='directorBack2 commonBack' style=' width:"+obj_left+"px;height:"+obj_height+"px;top:"+obj_top+"px;left:0px;'></div>";
			var commonback3 = "<div class='directorBack3 commonBack' style=' width:"+(1024-obj_width-obj_left)+"px;height:"+obj_height+"px;top:"+obj_top+"px;left:"+(obj_width+obj_left)+"px;'></div>";
			var commonback4 = "<div class='directorBack4 commonBack' style=' width:1024px;height:"+(827-obj_top-obj_height)+"px;top:"+(obj_top+obj_height)+"px;left:0px;'></div>";
			$("body").append(commonback1).append(commonback2).append(commonback3).append(commonback4);
		}
		if(main.specially){
			var html = '<div class="talkPop talkP pab fs22">'+main.specially+'</div>';
			$('.talkPop').remove();
			$('body').after(html);
		}
		if(main.addObj==true){
			var arrow = '<div class="zMarro1 pab" style="z-index:30;"><img src="image/sys/map_arrow.png"></div>';
			$('.zMarro1').remove();
			$('body').append(arrow);
		}
	},
	//新手引导点击公共对话框下一页
	clickNext:function(){
		$("#directorCon1").bind(clickEventType,function(){if(director.progress==35){$(".zhaoList ").trigger(clickEventType);return false;}director.updateProgress();});
	},
	//去掉下一步操作
	delNext:function(){
		$("#directorCon1").find("a").hide();
		$("#directorCon1").unbind(clickEventType);
	},
	isLoading:false
	,
	//修改用户新手指导到第几步信息
	updateProgress:function(){
		if(!director.isLoading){
			director.isLoading = true;
			++director.progress;
			$.getJSON(
					"http://"+host+"/sgg/i/top/y.php",
					{uid:userId,progress:director.progress},
					function(data){
						if(director.progress==43){
							director.endDirector();
						}else{
							director.startDirect(director.progress);
						}
						director.isLoading = false;
					}
			);
		}
	},
	//1-3级新手指引结束
	endDirector:function(){
		director.progress=0;
		$.getJSON(
				"http://"+host+"/sgg/i/top/y.php",
				{uid:userId,progress:director.progress},
				function(data){
					$('#windowBackwjWindow,#directorBack,#windowBacktaskwindow,#directorCon1').remove();
					DialogLevel=0;
					//$('#btn_task').append('<p class="pab" id="prompt_id" style="top:-10px;left:820px;"><img src="image/sys/prompt.png" /></p>');
				}
		);
	},
	commonUpadteProgress:function(){//公共修改新手执行到第几步函数
		$.getJSON(
				"http://"+host+"/sgg/i/top/y.php",
				{uid:userId,progress:director.progress}
		);
	},
	//选择点中特效
    setSelectWujiang:function(obj){
    	director.clearSelectWujiang();
    	var imgArray = ['se_select/1.png','se_select/2.png','se_select/3.png','se_select/4.png'];
        //圈圈的位置
    	var styleStr="width:95px;height:95px;overflow: hidden;";
    	var img = "<dd style='margin-top:-10px;margin-left:-8px;'><img id='bz_select' style='"+styleStr+"' src='image/sys/se_select/1.png'/></dd>";
    	$(obj).append(img);
    	var n = 0;
    	director.myselect = setInterval(function(){
    		$("#bz_select").attr("src","image/sys/"+imgArray[n]);
    		n++;
    		if(n==imgArray.length){
    			n=0;
    		}
    	},100);
    },
    clearSelectWujiang:function (){
    	clearInterval(director.myselect);
    	if(document.getElementById("bz_select")){
    		$("#bz_select").remove();
    	}	
    },
    //更新战斗推图进度
    updateBattleMap:function(battleCount){
    	//battleCount 记录战斗次数 1 虎牢关 第一场战斗 2虎牢关 第二场战斗 3虎牢关 第三场战斗
		$.getJN("http://" + host + "/sgg/i/common/common.php", {
			uid : userId,battleCount:battleCount
		}, function(data) {
			
		});
    },
    //公共新手调用
    publicDirector:function(progress){
    	director.startDirect(progress);
    }
}
/*
 * 新手指导各个步骤插件
 * conDir 用于区分当前说话者是玩家还是npc left为npc right为玩家
 * director.showDialog() 显示对话框内容   
 * director.clickNext() 点击对话框下一页执行的方法
 * id 需要多个地方显示某一部分内容  则传递次参数
 * jqueryStr 对象字符串  选择类 只显示某一部分区域内容
 * del 要删除的元素
 */
var directorPlugins = {
	"1":{
		"start":[{fun:function(){$('#wraper').show();}}]
	},
	"2":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		del:"#backgound",
		content:"大人，我大军已经接近敌军阵营！"
	},
	"3":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:0},
		conDir:"Right",
		content:"好！众兄弟随我出战！"
	},
	"4":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		obj:"#main_icon li:eq(1)>p",
		conDir:"Left",
		content:"请先进入“酒馆”，安排好出战将领！"
	},
	"5":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		obj:".alt img:eq(0)",
		conDir:"Left",
		content:"亲！请点击“招募”"
	},
	"6":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		obj:".altar",
		conDir:"Left",
		content:"亲！有一名武将等待您的招募，点击他"
	},
	"7":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:0},
		obj:"#btn_zhaomu",
		posBack:{top:176,left:786},
		setWH:2,
		BS:"small",
		conDir:"Left",
		content:"亲，请点击”招募“！"
	}
	,
	"8":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		content:"亲！招募武将成功！"
	},
	"9":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		content:"亲！我们来看看如何让武将参与战斗"
	},
	"10":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:555},
		obj:"#main_icon li:eq(2)>p",
		DialogLevel:true,
		conDir:"Left",
		BS:"small",
		content:"亲！请点击“阵容”按钮"
	},
	"11":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		obj:"#ZXWujiangList .cell:eq(0)",
		conDir:"Left",
		content:"亲！接下来选择刚才招募的武将"
	},
	"12":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		obj:"#z_5",
		conDir:"Left",
		content:"亲！将武将放入阵中"
	},
	"13":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		obj:"#close_buzhen_window",
		addObj:true,
		setWH:3,
		content:"亲！布阵成功，现在离开“阵容”"
	},
	"14":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		obj:".staWare img:eq(0)",
		conDir:"Left",
		del:".zMarro1",
		content:"请点击 ”讨伐“，荣我们一起来讨伐董贼！"
	},
	"15":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		obj:"#mapContainer div:eq(0) dl:eq(0)",
		conDir:"Left",
		content:"首战七星关，先试试实力！"
	},
	"16":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		isThree:"trueone",
		specially:"先小试伸手，看看我的厉害！",
		speciallyPos:{right:46},
		obj:"#smap_list div:eq(0)",
		content:"吕布的士气依然凶猛，先把他们的前军击败"
	},
	"17":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		isThree:"trueone",
		obj:"#smap_list div:eq(0)",
		delEvent:"#smap_list div:eq(0) ul:eq(0)",
		content:"点击战斗按钮开始战斗"
	},
	"18":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:0},
		conDir:"Left",
		BS:"small",
		content:"亲，您的能力果然不同凡响！"
	},
	"19":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:545},
		obj:"#btn_confirm",
		conDir:"Left",
		BS:"small",
		content:"现在点击“确认”按钮离开战斗"
	},
	"20":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		obj:".zhaoM>.x",
		addObj:true,
		setWH:3,
		del:true,
		content:"亲，您已经学会战斗，我们来看看还有什么可以学些的！"
	},
	"21":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:0},
		conDir:"Left",
		del:".zMarro1",
		obj:"#main_icon li:eq(4)>p",
		content:"亲，您有新的任务可以领取了！"
	},
	"22":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:0},
		conDir:"Left",
		BS:"small",
		content:"亲！完成任务可以获得巨额奖励！"
	},
	"23":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:0},
		conDir:"Left",
		BS:"small",
		del:"#windowBacktaskwindow",
		obj:".taskF .fl",
		posBack:{top:470,left:480},
		content:"请点击“前去完成”快速进入战斗！"
	},
	"24":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		isShow:true,
		specially:"来见识见识我的厉害！",
		obj:"#smap_list div:eq(0)",
		content:"点击怪物头像进入战斗"
	},
	"25":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		isShow:true,
		delEvent:"#smap_list div:eq(0) ul:eq(1)",
		obj:"#smap_list div:eq(0)",
		del:"#smap_list div:eq(0) ul:eq(1) li:eq(0) img:eq(1)",
		content:"点击战斗按钮开始战斗"
	},
	"26":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:545},
		conDir:"Left",
		obj:"#btn_confirm",
		BS:"small",
		content:"亲！恭喜，又一次获得了胜利！"
	},
	"27":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:0},
		conDir:"Left",
		BS:"small",
		del:"#smapWindow,#windowBacksmapWindow",
		obj:".taskF .fr",
		posBack:{top:470,left:740},
		content:"亲，完成了第一个任务，请点击领奖按钮领取奖励"
	},
	"28":{
		start:[{fun:function(){if(document.getElementById("taskwindow")==null){task.loadWindow();}director.showDialog();director.clickNext();}}],
		pos:{top:0,left:0},
		conDir:"Left",
		BS:"small",
		content:"有新的任务可以领取了"
	},
	"29":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:0},
		conDir:"Left",
		obj:".taskF .fl",
		BS:"small",
		posBack:{top:470,left:480},
		content:"亲！继续为理想战斗吧！"
	},
	"30":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		obj:"#smap_list div:eq(0)",
		isThree:true,
		specially:"让你看看我吕布的厉害！！看刀..........",
		content:"让我与吕布大战300回合!!!"
	},
	"31":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		obj:"#smap_list div:eq(0)",
		isThree:true,
		delEvent:"#smap_list div:eq(0) ul:eq(2)",
		content:"点击战斗"
	},
	"32":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:0},
		conDir:"Left",
		BS:"small",
		obj:"#btn_confirm",
		content:"亲，赶快把吕布刚刚掉落的装备穿上吧！"
	},
	"33":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		del:"#taskwindow",
		del1:"#smap_list div:eq(0) ul:eq(2)",
		content:"亲，战斗刚刚开始，赶快整理下自己的装备！"
	},
	"34":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:0},
		conDir:"Right",
		content:"应当怎样做呢？"
	},
	"35":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		//setWH:1,
		//posBack:{left:438,top:340},
		//obj:"#fromNpcList dl:eq(2)",
		content:"亲！首先进入武将"
	},
	"36":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		obj:"#WJequipList",
		posBack:{left:530,top:143},
		setWH:4,
		content:"亲！现在选择刚刚获得的装备"
	},
	"37":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		obj:"#wear",
		content:"亲！点击穿戴按钮即可完成装备了"
	},
	"38":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		content:"亲，您的战斗力大幅提升"
	},
	"39":{
		start:[{fun:function(){director.showDialog();director.delNext();}}],
		pos:{top:0,left:455},
		posBack:{top:60,left:900},
		obj:".x",
		addObj:true,
		conDir:"Left",
		setWH:3,
		content:"关闭武将页面"
	},
	"40":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:455},
		del:".zMarro1",
		conDir:"Left",
		content:"亲！后续战斗会越来越激烈！"
	},
	"41":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:0},
		conDir:"Right",
		content:"还有很多东西要努力学习！"
	},
	"42":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		content:"亲，我们先回去再说！"
	},
	"43":{
		start:[{fun:function(){director.showDialog();director.clickNext();}}],
		pos:{top:0,left:455},
		conDir:"Left",
		content:"亲，我们先回去再说！"
	}
}