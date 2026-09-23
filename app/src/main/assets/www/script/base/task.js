var task={
	index:0,
	loadWindow:function(index){
		var taskWindow = new mesWindow("taskwindow",$("#task_tmpl").html());
		$("#taskList").setSlider({row:1,col:1,dir:"top",onMove:task.setSlidBlock});
		task.getTaskInfo();
		if(index){
		}else{
			if(director.progress>0){
				director.updateProgress();
			}
		}
	},
	getTaskInfo:function(){
		$.getJSON("http://" + host + "/sgg/i/task/t.php", 
		{uid : userId}, 
		function(data) {
			if($("#taskList").length<=0)//如果为0表示弹窗没有弹出
				return;
			task.addTaskInfo(data.list);
			task.setSlidBlock();
			$('#prompt_id').remove();//删除新手指引添加的任务提示
		});
	},
	addTaskInfo:function(data){
		var container=$("#taskList");
		container.removeAllItem();
		if(data==undefined){
			return;
		}
		for(key in data){
			//对第一个进行特殊处理，右侧信息页面显示第一条任务的详细信息
			var item = $("<div class='taskLi'>"+data[key].name+"<p class='ywc' style='display:none;'></p></div>");
			if(data[key].status=="1"||data[key].status==1){
				item.find(".ywc").css("display","block");
			}
			if(key==0){
				item.attr("class","taskOv");
			}
			item.attr("data",JSON.stringify(data[key]));
			item.bind(clickEventType,task.taskListClick);
			container.addSliderItem(item);
		}
		$("#taskList>div>div").first().trigger(clickEventType);
		//director.handDirectFromOtherClass(task);//新手引导或者功能引导处理
	},
	//设置滑块位置
	setSlidBlock:function(){
		var sliderConTop=parseInt($("#taskList").children().slice(0,1).css("margin-top"));
		sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
		if(sliderConTop<=0){
			var conTopLimit=parseInt($("#taskList").children().slice(0,1).height())-parseInt($("#taskList").height());
			if(conTopLimit>=0){
				var sliderBlockTopLimit=348;
				var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
				top=top<0?0:top;
				top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
				$("#t_sBlock").css("margin-top",top+"px");
			}
		}
	},
	//任务列表单击事件
	taskListClick:function(){
		if(!Slider.checkTouchAvailabel(this)){
			return;
		}
		$(this).siblings().attr("class","taskLi");
		$(this).attr("class","taskOv");
		var data = JSON.parse($(this).attr("data"));
		var info = $.tmpl($("#taskinfo_tmpl"),data);
		info.find(".rwPic>img").attr("src","image/game/"+data.img);
		for(var key in data.reward){
			switch(data.reward[key].type){
				case "1":   //奖励金币
					info.find(".rwBox").append("钱币：<span class='cor62' style='margin-right:20px;'>"+data.reward[key].value+"</span>");
					break;
				case "2":   //奖励经验
					info.find(".rwBox").append("经验：<span class='cor82' style='margin-right:20px;'>"+data.reward[key].value+"</span>");
					break;
				case "3":   //道具
					info.find(".rwBox").append("  "+data.reward[key].propName+"  ");
					break;
				case "4":   //装备
					info.find(".rwBox").append("  "+data.reward[key].equipName+"  ");
					break;
				case "5":   //奖励经验
					info.find(".rwBox").append("元宝：<span class='cor82' style='margin-right:20px;'>"+data.reward[key].value+"</span>");
					break;
				case "6":   //奖励经验
					info.find(".rwBox").append("声望：<span class='cor82' style='margin-right:20px;'>"+data.reward[key].value+"</span>");
					break;
			}
		}
		//前往关卡按钮
		info.find(".taskF>a:eq(0)").attr({map:data.map_id,battle:data.battle_id,battle_order:data.battle_order,battle_type:data.battle_type,ubattle:data.user_bid,ubattle_order:data.user_bid_order})
		//判断战斗进度是否能去做任务
		if(data.battle_type=="1"){  //故事模式
			//if(parseInt(data.user_bid_order) >= parseInt(data.battle_order)){
				info.find(".taskF>a:eq(0)").addClass("pub_btn").removeClass("pub_btn4");
				info.find(".taskF>a:eq(0)").bind(clickEventType,function(){
					task.redirectToMap($(this).attr("map"),$(this).attr("battle"),$(this).attr("battle_type"));
				});
			//}
		}
		if(data.battle_type=="2"){  //精英模式
			//if(parseInt(data.user_jy_order) >= parseInt(data.battle_order)){
				info.find(".taskF>a:eq(0)").addClass("pub_btn").removeClass("pub_btn4");
				info.find(".taskF>a:eq(0)").bind(clickEventType,function(){
					elite.clickEliteCallBack(data.battle_id,data.map_id);
				});
			//}
		}
		//三种新类型任务
		if(data.conType=="4"){  //武将招募
			info.find(".needName").text("已招募");
			info.find(".taskF>a:eq(0)").addClass("pub_btn").removeClass("pub_btn4");
			info.find(".taskF>a:eq(0)").unbind(clickEventType);
			info.find(".taskF>a:eq(0)").bind(clickEventType,function(){
				Zhaomu.loadWindow();
			});
		}else if(data.conType=="5"){  //已上阵人数
			info.find(".needName").text("已上阵");
			info.find(".taskF>a:eq(0)").addClass("pub_btn").removeClass("pub_btn4");
			info.find(".taskF>a:eq(0)").unbind(clickEventType);
			info.find(".taskF>a:eq(0)").bind(clickEventType,function(){
				Buzhen.loadWindow();
			});
		}else if(data.conType=="6"){  //已强化级别
			info.find(".needName").text("已强化");
			info.find(".taskF>a:eq(0)").addClass("pub_btn").removeClass("pub_btn4");
			info.find(".taskF>a:eq(0)").unbind(clickEventType);
			info.find(".taskF>a:eq(0)").bind(clickEventType,function(){
				qianghua.loadWindow();
			});
		}
		
		
		
		//任务已完成(领奖按钮)
		if(data.status=="1"){
			info.find(".taskNeed span").removeClass("cor98 ").addClass("cor82");
			//领取按钮
			info.find(".taskF>a:eq(1)").removeClass("pub_btn4").addClass("pub_btn");
			info.find(".taskF>a:eq(1)").attr("task",data.task_id).bind(clickEventType,function(){
				$(this).unbind(clickEventType);
				task.finishedTask($(this).attr("task"));
			});
		}else{
			info.find(".taskF>a:eq(1)").removeClass("pub_btn").addClass("pub_btn4");
			info.find(".taskF>a:eq(1)").unbind(clickEventType);
		}
		$("#taskInfoContainer").html(info);
		/*if(task.index==2){
			$('.taskF>.fl').addClass("highlight");
		}*/
	}
	,
	redirectToMap:function(mapid,battleid,type){
		//battle_type与前端的不吻合，在此进行校正（随后需要处理）
		//type = parseInt(type)-1;
		//载入故事模式
		map.loadSmallMapWindowFromOtherWin(mapid,battleid,type);
	},
	preventStartTask:function(){
		Common.alert("暂时无法完成，请继续推进征战故事<span class='cor95 stro13'>征战故事 </span>",1,hotLinks.smmode);
	},
	finishedTask:function($taskID){
		$.getJN("http://" + host + "/sgg/i/task/t.php", 
		{uid : userId,taskID:$taskID},
		function(data) {
			task.addTaskInfo(data.list);
			user.refreshTaskInfo(data.list);
			user.refreshUserInfo(data.user);
			if(director.progress>0){
				director.updateProgress();
			}
			Buzhen.refreshUserFormation();
			//director.handDirectFromOtherClass(task);//新手引导或者功能引导处理
		});
	},
	squarePromptClick:function(obj,interval,wCloseId){  //方形转动选择效果
    	var newId = $(obj).attr("id")+"prompt";
    	var imgArray = ["se_prompt/f1.png","se_prompt/f2.png","se_prompt/f3.png","se_prompt/f4.png"
    					,"se_prompt/f5.png","se_prompt/f6.png","se_prompt/f7.png"];
    	var styleStr="width:193px;height:70px;overflow: hidden;";
    	var img = "<li style='padding:0; margin-top:-62px;margin-left:-15px;'><img id='"+newId+"' style='"+styleStr+"' src='image/sys/se_prompt/f1.png'/></li>";
    	$(obj).parent().append(img);
    	var n = 1;
    	interval = setInterval(function(){
    		$("#"+newId).attr("src","image/sys/"+imgArray[n]);
    		n++;
    		if(n==imgArray.length){
    			n=0;
    		}
    	},150);
    	$("#"+newId+",#"+wCloseId).live(clickEventType,function(){
    		if(this.id==newId){
    			$(obj).trigger(clickEventType);
    		}
    		if(document.getElementById(newId)){
    			$("#"+newId).remove();
    		}
    		if(interval){
    			clearInterval(interval);
    		}
    	});
    }
}


